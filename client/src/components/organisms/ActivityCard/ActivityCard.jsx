import ActivityMeta from '../../molecules/ActivityMeta/ActivityMeta.jsx'
import styles from './ActivityCard.module.css'

export default function ActivityCard({ activity, compact = false, children }) {
  return (
    <article className={styles.card}>
      <h2 className={styles.title}>{activity.name}</h2>
      <ActivityMeta
        category={activity.category}
        duration={activity.duration}
        difficulty={activity.difficulty}
        size="large"
      />
      {!compact && <p className={styles.description}>{activity.description}</p>}
      {!compact && children}
    </article>
  )
}
