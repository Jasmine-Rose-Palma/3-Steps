import Button from '../../atoms/Button/Button.jsx'
import TextField from '../../atoms/TextField/TextField.jsx'
import PhotoPicker from '../../molecules/PhotoPicker/PhotoPicker.jsx'
import styles from './ProofForm.module.css'

export default function ProofForm({ activity, value, onChange, onSubmit, submitting = false }) {
  const isPhoto = activity.proofType === 'photo'
  const filled = isPhoto ? Boolean(value) : typeof value === 'string' && value.trim() !== ''

  function handleSubmit(event) {
    event.preventDefault()
    if (filled && !submitting) onSubmit()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {isPhoto ? (
        <PhotoPicker
          id="proof-photo"
          label={activity.proofPrompt}
          value={value}
          onChange={onChange}
          activityName={activity.name}
          size="large"
        />
      ) : (
        <TextField
          id="proof-text"
          label={activity.proofPrompt}
          value={value ?? ''}
          onChange={onChange}
          multiline
          size="large"
        />
      )}
      <Button type="submit" variant="accent" size="large" fullWidth disabled={!filled || submitting}>
        {submitting ? 'Saving...' : 'Mark Complete'}
      </Button>
    </form>
  )
}
