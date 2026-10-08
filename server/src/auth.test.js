import { describe, it, expect, beforeAll, vi } from 'vitest'
import express from 'express'
import request from 'supertest'
import { generateKeyPair, exportJWK, createLocalJWKSet, SignJWT } from 'jose'
import { getBearerToken, createRequireUser, createSupabaseVerifier } from './auth.js'

// ---- Setup: our own signing keys, standing in for Supabase's ----------------
const SUPABASE_URL = 'https://abcd1234.supabase.co'
let privateKey, otherPrivateKey, keySet

beforeAll(async () => {
  const pair = await generateKeyPair('ES256')
  privateKey = pair.privateKey
  otherPrivateKey = (await generateKeyPair('ES256')).privateKey
  const jwk = await exportJWK(pair.publicKey)
  keySet = createLocalJWKSet({ keys: [{ ...jwk, alg: 'ES256', use: 'sig' }] })
})

// Build a token the way Supabase would, with overrides for the bad cases.
function makeToken({ key = privateKey, alg = 'ES256', issuer = `${SUPABASE_URL}/auth/v1`, audience = 'authenticated', expiresIn = '1h', sub = 'user-123' } = {}) {
  return new SignJWT({ role: 'authenticated' })
    .setProtectedHeader({ alg })
    .setSubject(sub)
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key)
}

// A fake request, just enough for getBearerToken.
const fakeReq = (headers) => ({ get: (name) => headers[name.toLowerCase()] })

describe('Setup (provided): createSupabaseVerifier - these should already pass', () => {
  // Built when called, because keySet only exists after beforeAll has run.
  const verify = (token) => createSupabaseVerifier(SUPABASE_URL, keySet)(token)

  it('accepts a good token and returns its payload', async () => {
    const payload = await verify(await makeToken({ sub: 'user-123' }))
    expect(payload.sub).toBe('user-123')
  })

  it('rejects an expired token', async () => {
    await expect(verify(await makeToken({ expiresIn: '-1h' }))).rejects.toMatchObject({ code: 'ERR_JWT_EXPIRED' })
  })

  it('rejects a token from a different project (wrong issuer)', async () => {
    await expect(verify(await makeToken({ issuer: 'https://evil.supabase.co/auth/v1' }))).rejects.toMatchObject({ code: 'ERR_JWT_CLAIM_VALIDATION_FAILED' })
  })

  it('rejects a token that is not for signed-in users (wrong audience)', async () => {
    await expect(verify(await makeToken({ audience: 'anon' }))).rejects.toMatchObject({ code: 'ERR_JWT_CLAIM_VALIDATION_FAILED' })
  })

  it('rejects a token signed with someone else\'s key', async () => {
    await expect(verify(await makeToken({ key: otherPrivateKey }))).rejects.toMatchObject({ code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' })
  })

  it('rejects a tampered token', async () => {
    const token = await makeToken()
    const [h, , s] = token.split('.')
    const forgedPayload = Buffer.from(JSON.stringify({ sub: 'someone-else', iss: `${SUPABASE_URL}/auth/v1`, aud: 'authenticated', exp: 9999999999 })).toString('base64url')
    await expect(verify(`${h}.${forgedPayload}.${s}`)).rejects.toMatchObject({ code: 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED' })
  })

  it('rejects a token signed with a shared secret (HS256)', async () => {
    const secret = new TextEncoder().encode('a-shared-secret-that-is-long-enough-123456')
    const token = await makeToken({ key: secret, alg: 'HS256' })
    await expect(verify(token)).rejects.toMatchObject({ code: 'ERR_JOSE_ALG_NOT_ALLOWED' })
  })
})

describe('TODO 14: getBearerToken', () => {
  it('returns the token from "Bearer <token>"', () => {
    expect(getBearerToken(fakeReq({ authorization: 'Bearer abc.def.ghi' }))).toBe('abc.def.ghi')
  })

  it('accepts the word Bearer in any letter case', () => {
    expect(getBearerToken(fakeReq({ authorization: 'bearer abc' }))).toBe('abc')
  })

  it('returns null when there is no Authorization header', () => {
    expect(getBearerToken(fakeReq({ authorization: 'Bearer abc' }))).toBe('abc') // a real header must work first
    expect(getBearerToken(fakeReq({}))).toBeNull()
  })

  it('returns null for the wrong scheme, a missing token, or extra words', () => {
    expect(getBearerToken(fakeReq({ authorization: 'Bearer abc' }))).toBe('abc') // a real header must work first
    expect(getBearerToken(fakeReq({ authorization: 'Basic abc' }))).toBeNull()
    expect(getBearerToken(fakeReq({ authorization: 'Bearer' }))).toBeNull()
    expect(getBearerToken(fakeReq({ authorization: 'Bearer a b' }))).toBeNull()
  })
})

describe('TODO 15: createRequireUser', () => {
  // A tiny app with one protected route that echoes who the user is.
  const verifyToken = vi.fn(async (token) => {
    if (token === 'good') return { sub: 'user-1' }
    if (token === 'no-sub') return {}
    throw new Error('bad token')
  })
  const app = express()
  app.get('/me', createRequireUser(verifyToken), (req, res) => res.json({ userId: req.userId }))
  const asUser = (header) => request(app).get('/me').set('Authorization', header)

  it('lets a valid token through and sets req.userId from the token', async () => {
    const res = await asUser('Bearer good')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ userId: 'user-1' })
  })

  it('answers 401 with { error } when there is no token', async () => {
    expect((await asUser('Bearer good')).status).toBe(200) // a real token must work first
    verifyToken.mockClear()
    const res = await request(app).get('/me')
    expect(res.status).toBe(401)
    expect(res.body.error).toBeTruthy()
    expect(verifyToken).not.toHaveBeenCalled()
  })

  it('answers 401 (not 500) when the token is fake or expired', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect((await asUser('Bearer good')).status).toBe(200) // a real token must work first
    const res = await asUser('Bearer forged')
    expect(res.status).toBe(401)
    expect(res.body.error).toBeTruthy()
  })

  it('answers 401 when the token has no sub', async () => {
    expect((await asUser('Bearer good')).status).toBe(200) // a real token must work first
    const res = await asUser('Bearer no-sub')
    expect(res.status).toBe(401)
  })

  it('does not accept the old x-user-id header any more', async () => {
    expect((await asUser('Bearer good')).status).toBe(200) // a real token must work first
    const res = await request(app).get('/me').set('x-user-id', 'sample-user')
    expect(res.status).toBe(401)
  })
})
