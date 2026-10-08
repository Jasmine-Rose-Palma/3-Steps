import styles from './Tag.module.css'

export default function Tag({ label, size = 'small' }) {
  return (
    <span className={styles.tag} data-size={size}>
      {label}
    </span>
  )
}
