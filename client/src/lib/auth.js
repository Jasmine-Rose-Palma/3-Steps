export function toSession(user) {
  if (!user) {
    return null
  }
  const meta = user.user_metadata ?? {}
  const displayName = meta.full_name || meta.name || user.email?.split('@')[0] || 'friend'
  return { id: user.id, email: user.email, displayName }
}

const NOT_CONFIGURED =
  "Login isn't set up yet. Add your Supabase URL and key to frontend/.env (see the README), then restart npm run dev."

export function createAuth(supabase) {
  if (!supabase) {
    return {
      onChange(callback) {
        callback(null)
        return () => {}
      },
      async getToken() {
        return null
      },
      async signIn() {
        throw new Error(NOT_CONFIGURED)
      },
      async signUp() {
        throw new Error(NOT_CONFIGURED)
      },
      async signInWithGoogle() {
        throw new Error(NOT_CONFIGURED)
      },
      async signOut() {},
    }
  }

  return {
    onChange(callback) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(toSession(session?.user))
      })
      return () => data.subscription.unsubscribe()
    },
    async getToken() {
      const { data } = await supabase.auth.getSession()
      return data.session?.access_token ?? null
    },
    async signIn(email, password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    },
    async signUp(email, password) {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      return { needsConfirmation: !data.session }
    },
    async signInWithGoogle() {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}` },
      })
      if (error) throw error
    },
    async signOut() {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
  }
}
