import { useCallback, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { createApi } from './lib/api.js'
import { createAuth } from './lib/auth.js'
import { supabase } from './lib/supabase.js'
import { pickRandom } from './lib/pick.js'
import LoginPage from './pages/LoginPage/LoginPage.jsx'
import HomePage from './pages/HomePage/HomePage.jsx'
import SuggestionPage from './pages/SuggestionPage/SuggestionPage.jsx'
import ProofPage from './pages/ProofPage/ProofPage.jsx'
import ProgressPage from './pages/ProgressPage/ProgressPage.jsx'

const defaultAuth = createAuth(supabase)
const defaultApi = createApi({
  baseUrl: import.meta.env.VITE_API_URL || '/api',
  getToken: () => defaultAuth.getToken(),
})

export default function App({ api = defaultApi, auth = defaultAuth }) {
  const navigate = useNavigate()
  const [session, setSession] = useState(undefined)
  const [activities, setActivities] = useState([])
  const [matches, setMatches] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [selectedEnergy, setSelectedEnergy] = useState(null)
  const [currentActivity, setCurrentActivity] = useState(null)
  const [completedActivities, setCompletedActivities] = useState([])
  const [progressStatus, setProgressStatus] = useState('loading')

  useEffect(() => auth.onChange(setSession), [auth])

  const userId = session?.id
  useEffect(() => {
    if (!userId) {
      setActivities([])
      setMatches([])
      setSelectedTime(null)
      setSelectedEnergy(null)
      setCurrentActivity(null)
      setCompletedActivities([])
      setProgressStatus('loading')
      return undefined
    }
    let cancelled = false
    setProgressStatus('loading')
    Promise.all([api.getActivities(), api.getCompletions()])
      .then(([allActivities, completions]) => {
        if (cancelled) return
        setActivities(allActivities)
        setCompletedActivities(completions)
        setProgressStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setProgressStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [userId, api])

  const findActivity = useCallback(async () => {
    const list = await api.getActivities({ time: selectedTime, energy: selectedEnergy })
    setMatches(list)
    if (list.length === 0) return false
    setCurrentActivity(pickRandom(list))
    return true
  }, [api, selectedTime, selectedEnergy])

  const showAnother = useCallback(() => {
    setCurrentActivity((current) => pickRandom(matches, current?.id))
  }, [matches])

  const completeActivity = useCallback(
    async (activity) => {
      const completion = await api.addCompletion(activity.id)
      setCompletedActivities((previous) => [completion, ...previous])
    },
    [api]
  )

  const finishFlow = useCallback(() => {
    setCurrentActivity(null)
    navigate('/')
  }, [navigate])

  const signOut = useCallback(() => {
    auth.signOut().catch(() => {})
  }, [auth])

  if (session === undefined) {
    return (
      <main style={{ padding: 'var(--space-4) var(--space-2)' }}>
        <p role="status">Loading...</p>
      </main>
    )
  }

  const requireSession = (element) => (session ? element : <Navigate to="/login" replace />)
  const requireActivity = (render) =>
    requireSession(currentActivity ? render(currentActivity) : <Navigate to="/" replace />)

  return (
    <Routes>
      <Route
        path="/login"
        element={
          session ? (
            <Navigate to="/" replace />
          ) : (
            <LoginPage
              onSignIn={auth.signIn}
              onSignUp={auth.signUp}
              onGoogle={auth.signInWithGoogle}
            />
          )
        }
      />
      <Route
        path="/"
        element={requireSession(
          <HomePage
            displayName={session?.displayName}
            selectedTime={selectedTime}
            selectedEnergy={selectedEnergy}
            onTimeChange={setSelectedTime}
            onEnergyChange={setSelectedEnergy}
            onFind={findActivity}
            onSignOut={signOut}
          />
        )}
      />
      <Route
        path="/suggestion"
        element={requireActivity((activity) => (
          <SuggestionPage activity={activity} onShowAnother={showAnother} onSignOut={signOut} />
        ))}
      />
      <Route
        path="/proof"
        element={requireActivity((activity) => (
          <ProofPage
            key={activity.id}
            activity={activity}
            onComplete={completeActivity}
            onDone={finishFlow}
            onSignOut={signOut}
          />
        ))}
      />
      <Route
        path="/progress"
        element={requireSession(
          <ProgressPage
            status={progressStatus}
            completedActivities={completedActivities}
            activities={activities}
            onSignOut={signOut}
          />
        )}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
