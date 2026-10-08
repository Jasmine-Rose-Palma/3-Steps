import HistoryItem from '../../molecules/HistoryItem/HistoryItem.jsx'
import styles from './HistoryList.module.css'

export default function HistoryList({ completions, activities }) {
  const byId = new Map(activities.map((activity) => [activity.id, activity]))
  return (
    <ul className={styles.list}>
      {completions.map((completion) => {
        const activity = byId.get(completion.activityId)
        if (!activity) {
          return null
        }
        return (
          <HistoryItem
            key={completion.id}
            name={activity.name}
            category={activity.category}
            duration={activity.duration}
            difficulty={activity.difficulty}
            completedAt={completion.completedAt}
          />
        )
      })}
    </ul>
  )
}
