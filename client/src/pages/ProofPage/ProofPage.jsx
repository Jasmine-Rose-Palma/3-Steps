import { useEffect, useState } from 'react'
import PageLayout from '../../components/layout/PageLayout/PageLayout.jsx'
import Heading from '../../components/atoms/Heading/Heading.jsx'
import ActivityCard from '../../components/organisms/ActivityCard/ActivityCard.jsx'
import ProofForm from '../../components/organisms/ProofForm/ProofForm.jsx'
import styles from './ProofPage.module.css'

export const RETURN_DELAY_MS = 2500

export default function ProofPage({ activity, onComplete, onDone, onSignOut }) {
  const [proofInput, setProofInput] = useState(activity.proofType === 'photo' ? null : '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!done) return undefined
    const timer = setTimeout(onDone, RETURN_DELAY_MS)
    return () => clearTimeout(timer)
  }, [done, onDone])

  async function handleSubmit() {
    setSubmitting(true)
    setError('')
    try {
      await onComplete(activity)
      setDone(true)
    } catch (err) {
      setError(err.message || "That didn't save. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageLayout onSignOut={onSignOut} activity>
      <Heading level={1} centered>
        Show what you did
      </Heading>
      <ActivityCard activity={activity} compact />
      {done ? (
        <p role="status" className={styles.confirmation}>
          Nice work. That one&apos;s logged. Taking you home...
        </p>
      ) : (
        <>
          <ProofForm
            activity={activity}
            value={proofInput}
            onChange={setProofInput}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}
        </>
      )}
    </PageLayout>
  )
}
