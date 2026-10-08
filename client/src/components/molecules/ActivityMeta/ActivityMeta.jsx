import Tag from '../../atoms/Tag/Tag.jsx'
import Badge from '../../atoms/Badge/Badge.jsx'
import { difficultyLabel } from '../../../lib/labels.js'
import styles from './ActivityMeta.module.css'

export default function ActivityMeta({ category, duration, difficulty, size = 'small' }) {
  return (
    <div className={styles.meta}>
      <Tag label={category} size={size} />
      <Badge label={duration} size={size} />
      <Badge label={difficultyLabel(difficulty)} size={size} />
    </div>
  )
}
