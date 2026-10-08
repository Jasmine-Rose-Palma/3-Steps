import Button from '../../atoms/Button/Button.jsx'
import styles from './SelectorGroup.module.css'

export default function SelectorGroup({ legend, options, value, onChange }) {
  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.options}>
        {options.map((option) => {
          const chosen = option.value === value
          return (
            <Button
              key={option.value}
              fullWidth
              size="large"
              style={chosen ? 'filled' : 'outline'}
              aria-pressed={chosen}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </Button>
          )
        })}
      </div>
    </fieldset>
  )
}
