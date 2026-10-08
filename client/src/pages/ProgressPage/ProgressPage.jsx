import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout/PageLayout.jsx'
import Heading from '../../components/atoms/Heading/Heading.jsx'
import Button from '../../components/atoms/Button/Button.jsx'
import HistoryList from '../../components/organisms/HistoryList/HistoryList.jsx'
import styles from './ProgressPage.module.css'

export default function ProgressPage({ status, completedActivities, activities, onSignOut }) {
  const navigate = useNavigate()
  const count = completedActivities.length

  let body
  if (status === 'loading') {
    body = <p role="status">Loading your progress...</p>
  } else if (status === 'error') {
    body = (
      <p role="alert" className={styles.error}>
        We couldn&apos;t load your progress. Check that the API is running, then refresh.
      </p>
    )
  } else if (count === 0) {
    body = (
      <div className={styles.empty}>
        <p>Nothing here yet. Your first little win is one tap away.</p>
        <Button variant="accent" onClick={() => navigate('/')}>
          Find an activity
        </Button>
      </div>
    )
  } else {
    body = (
      <>
        <p className={styles.stat}>
          {count} {count === 1 ? 'activity' : 'activities'} completed
        </p>
        <HistoryList completions={completedActivities} activities={activities} />
      </>
    )
  }

  return (
    <PageLayout activeLink="progress" onSignOut={onSignOut} wide>
      <Heading level={1}>Your little wins</Heading>
      {body}
    </PageLayout>
  )
}
