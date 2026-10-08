import { useNavigate } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout/PageLayout.jsx'
import Heading from '../../components/atoms/Heading/Heading.jsx'
import Button from '../../components/atoms/Button/Button.jsx'
import ActivityCard from '../../components/organisms/ActivityCard/ActivityCard.jsx'
import styles from './SuggestionPage.module.css'

export default function SuggestionPage({ activity, onShowAnother, onSignOut }) {
  const navigate = useNavigate()

  return (
    <PageLayout onSignOut={onSignOut} activity>
      <Heading level={1} centered>
        Here&apos;s something for you...
      </Heading>
      <ActivityCard activity={activity}>
        <div className={styles.actions}>
          <Button variant="accent" size="large" fullWidth onClick={() => navigate('/proof')}>
            Do this
          </Button>
          <Button variant="accent" style="outline" size="large" fullWidth onClick={onShowAnother}>
            Show another
          </Button>
        </div>
      </ActivityCard>
    </PageLayout>
  )
}
