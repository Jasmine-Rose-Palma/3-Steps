import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout/PageLayout.jsx'
import Heading from '../../components/atoms/Heading/Heading.jsx'
import Button from '../../components/atoms/Button/Button.jsx'
import SelectorGroup from '../../components/molecules/SelectorGroup/SelectorGroup.jsx'
import { TIME_OPTIONS, ENERGY_OPTIONS } from '../../lib/labels.js'
import styles from './HomePage.module.css'

export default function HomePage({
  displayName,
  selectedTime,
  selectedEnergy,
  onTimeChange,
  onEnergyChange,
  onFind,
  onSignOut,
}) {
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  async function handleFind() {
    setBusy(true)
    setMessage('')
    try {
      const found = await onFind()
      if (found) navigate('/suggestion')
      else setMessage('Nothing matched that mix. Try a different time or energy.')
    } catch (error) {
      setMessage(error.message || 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const ready = selectedTime !== null && selectedEnergy !== null

  return (
    <PageLayout activeLink="home" onSignOut={onSignOut} centered>
      <div className={styles.intro}>
        {displayName && <p className={styles.greeting}>Hi, {displayName}!</p>}
        <Heading level={1} display>
          What do you feel like doing today...
        </Heading>
      </div>

      <div className={styles.picker}>
        <SelectorGroup
          legend="How much time do you have?"
          options={TIME_OPTIONS}
          value={selectedTime}
          onChange={onTimeChange}
        />
        <SelectorGroup
          legend="How much energy do you have?"
          options={ENERGY_OPTIONS}
          value={selectedEnergy}
          onChange={onEnergyChange}
        />
        <div className={styles.action}>
          <Button variant="accent" size="large" fullWidth disabled={!ready || busy} onClick={handleFind}>
            {busy ? 'Looking...' : 'Find an activity'}
          </Button>
          {!ready && <p className={styles.hint}>Pick a time and an energy level to continue.</p>}
          {message && (
            <p role="alert" className={styles.message}>
              {message}
            </p>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
