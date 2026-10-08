import styles from './TextField.module.css'

export default function TextField({
  id,
  label,
  value,
  onChange,
  multiline = false,
  type = 'text',
  hint,
  size = 'default',
  ...rest
}) {
  const hintId = hint ? `${id}-hint` : undefined
  const shared = {
    id,
    className: styles.input,
    value,
    onChange: (event) => onChange(event.target.value),
    'aria-describedby': hintId,
    ...rest,
  }
  return (
    <div className={styles.field} data-size={size}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {multiline ? <textarea rows={4} {...shared} /> : <input type={type} {...shared} />}
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
    </div>
  )
}
