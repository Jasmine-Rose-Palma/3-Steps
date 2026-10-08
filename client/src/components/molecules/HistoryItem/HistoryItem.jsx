import ActivityMeta from '../ActivityMeta/ActivityMeta.jsx'
import { formatCompletedDate } from '../../../lib/labels.js'
import styles from './HistoryItem.module.css'

export default function HistoryItem({ name, category, duration, difficulty, completedAt }) {
  return (
    <li className={styles.item}>
      <span className={styles.name}>{name}</span>
      <ActivityMeta category={category} duration={duration} difficulty={difficulty} />
      <time className={styles.date} dateTime={completedAt}>
        {formatCompletedDate(completedAt)}
      </time>
    </li>
  )
}
