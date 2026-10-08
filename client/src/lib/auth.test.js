import { describe, it, expect, vi } from 'vitest'
import { createAuth, toSession } from './auth.js'

function fakeSupabase({ session = null, error = null, signUpSession = null } = {}) {
  let handler
  const unsubscribe = vi.fn()
  return {
    unsubscribe,
    fire: (event, s) => handler(event, s),
    auth: {
      onAuthStateChange: vi.fn((cb) => {
        handler = cb
        return { data: { subscription: { unsubscribe } } }
      }),
      getSession: vi.fn(async () => ({ data: { session } })),
      signInWithPassword: vi.fn(async () => ({ error })),
      signUp: vi.fn(async () => ({ data: { session: signUpSession }, error })),
      signInWithOAuth: vi.fn(async () => ({ error })),
      signOut: vi.fn(async () => ({ error })),
    },
  }
}

describe('toSession', () => {
  it('is null when nobody is signed in', () => {
    expect(toSession(null)).toBeNull()
    expect(toSession(undefined)).toBeNull()
  })

  it('uses the Google name when there is one', () => {
    const user = { id: 'u', email: 'a@b.com', user_metadata: { full_name: 'Sample User' } }
    expect(toSession(user)).toEqual({ id: 'u', email: 'a@b.com', displayName: 'Sample User' })
  })

  it('falls back to the part of the email before the @', () => {
    expect(toSession({ id: 'u', email: 'jas@example.com' }).displayName).toBe('jas')
  })
})

describe('createAuth with Supabase', () => {
  it('reports session changes as { id, email, displayName } and can unsubscribe', () => {
    const sb = fakeSupabase()
    const callback = vi.fn()
    const stop = createAuth(sb).onChange(callback)

    sb.fire('INITIAL_SESSION', null)
    sb.fire('SIGNED_IN', { user: { id: 'u1', email: 'x@y.com' } })
    expect(callback).toHaveBeenNthCalledWith(1, null)
    expect(callback).toHaveBeenNthCalledWith(2, { id: 'u1', email: 'x@y.com', displayName: 'x' })

    stop()
    expect(sb.unsubscribe).toHaveBeenCalled()
  })

  it('gives back the access token, or null when signed out', async () => {
    expect(await createAuth(fakeSupabase({ session: { access_token: 'tok' } })).getToken()).toBe('tok')
    expect(await createAuth(fakeSupabase()).getToken()).toBeNull()
  })

  it('signs in with email and password', async () => {
    const sb = fakeSupabase()
    await createAuth(sb).signIn('a@b.com', 'pw')
    expect(sb.auth.signInWithPassword).toHaveBeenCalledWith({ email: 'a@b.com', password: 'pw' })
  })

  it("throws Supabase's error so the Login screen can show it", async () => {
    const sb = fakeSupabase({ error: new Error('Invalid login credentials') })
    await expect(createAuth(sb).signIn('a@b.com', 'bad')).rejects.toThrow('Invalid login credentials')
  })

  it('signUp says whether an email confirmation is still needed', async () => {
    expect(await createAuth(fakeSupabase()).signUp('a@b.com', 'secret1')).toEqual({ needsConfirmation: true })
    const withSession = fakeSupabase({ signUpSession: { access_token: 't' } })
    expect(await createAuth(withSession).signUp('a@b.com', 'secret1')).toEqual({ needsConfirmation: false })
  })

  it('starts Google sign-in and returns to this site', async () => {
    const sb = fakeSupabase()
    await createAuth(sb).signInWithGoogle()
    expect(sb.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    })
  })

  it('signs out', async () => {
    const sb = fakeSupabase()
    await createAuth(sb).signOut()
    expect(sb.auth.signOut).toHaveBeenCalled()
  })
})

describe('createAuth without Supabase configured', () => {
  it('reports "signed out" straight away instead of crashing', () => {
    const callback = vi.fn()
    createAuth(null).onChange(callback)
    expect(callback).toHaveBeenCalledWith(null)
  })

  it('explains what is missing when someone tries to sign in', async () => {
    const auth = createAuth(null)
    await expect(auth.signIn('a@b.com', 'pw')).rejects.toThrow(/frontend\/\.env/)
    await expect(auth.signInWithGoogle()).rejects.toThrow(/frontend\/\.env/)
    expect(await auth.getToken()).toBeNull()
  })
})
