import { useEffect, useState } from 'react'
import styles from './PhotoPicker.module.css'

export default function PhotoPicker({ id, label, value, onChange, activityName, size = 'default' }) {
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    if (!value || typeof URL.createObjectURL !== 'function') {
      setPreviewUrl(null)
      return undefined
    }
    const url = URL.createObjectURL(value)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [value])

  return (
    <div className={styles.picker} data-size={size}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.box} data-filled={value ? 'true' : undefined}>
        <input
          id={id}
          type="file"
          accept="image/*"
          className={styles.input}
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        />
        {previewUrl ? (
          <img src={previewUrl} alt={activityName} className={styles.preview} />
        ) : (
          <span className={styles.prompt}>{value ? value.name : 'Tap to choose a photo'}</span>
        )}
        {value && <span className={styles.change}>Tap to choose a different photo</span>}
      </div>
      <p className={styles.note}>Your photo stays on this device. It is not uploaded.</p>
    </div>
  )
}
