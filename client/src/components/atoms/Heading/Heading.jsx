import styles from './Heading.module.css'

export default function Heading({
  level = 1,
  display = false,
  centered = false,
  accent = false,
  children,
}) {
  const Tag = `h${level}`
  return (
    <Tag
      className={styles.heading}
      data-display={display ? 'true' : undefined}
      data-centered={centered ? 'true' : undefined}
      data-accent={accent ? 'true' : undefined}
    >
      {children}
    </Tag>
  )
}
