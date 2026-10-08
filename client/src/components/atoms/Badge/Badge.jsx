import styles from './Badge.module.css'

export default function Badge({ label, size = 'small' }) {
  return (
    <span className={styles.badge} data-size={size}>
      {label}
    </span>
  )
}
