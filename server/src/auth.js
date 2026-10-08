import { createRemoteJWKSet, jwtVerify } from 'jose'

export function getBearerToken(req) {
  const header = req.get('authorization')
  if (!header) return null
  const parts = header.trim().split(/\s+/)
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') return null
  return parts[1]
}

export function createRequireUser(verifyToken) {
  return async function requireUser(req, res, next) {
    const token = getBearerToken(req)
    if (!token) {
      return res.status(401).json({error: 'Sign in required'})
    }
    let payload
    try {
      payload = await verifyToken(token)
    } catch (err) {
      return res.status(401).json({error: 'Invalid or expired login'})
    }
    if (!payload.sub) {
      return res.status(401).json({error: 'Invalid or expired login'})
    }
    req.userId = payload.sub
    next()
  }
}

export function createSupabaseVerifier(supabaseUrl, keySet) {
  const base = supabaseUrl.replace(/\/+$/, '')
  const keys = keySet ?? createRemoteJWKSet(new URL(`${base}/auth/v1/.well-known/jwks.json`))
  return async function verifyToken(token) {
    const { payload } = await jwtVerify(token, keys, {
      issuer: `${base}/auth/v1`,
      audience: 'authenticated',
      algorithms: ['ES256', 'RS256'],
    })
    return payload
  }
}

let realVerifier
export async function defaultVerifyToken(token) {
  if (!realVerifier) {
    const url = process.env.SUPABASE_URL
    if (!url) throw new Error('SUPABASE_URL is not set. Add it to your .env file.')
    realVerifier = createSupabaseVerifier(url)
  }
  return realVerifier(token)
}
