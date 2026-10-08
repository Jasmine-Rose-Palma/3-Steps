import styles from './Button.module.css'

export default function Button({
  variant = 'primary',
  style = 'filled',
  size = 'small',
  fullWidth = false,
  type = 'button',
  onClick,
  disabled = false,
  children,
  ...rest
}) {
  return (
    <button
      {...rest}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={styles.button}
      data-variant={variant}
      data-style={style}
      data-size={size}
      data-full={fullWidth ? 'true' : undefined}
    >
      {children}
    </button>
  )
}
