import Header from '../../organisms/Header/Header.jsx'
import styles from './PageLayout.module.css'

export default function PageLayout({
  activeLink,
  onSignOut,
  wide = false,
  centered = false,
  activity = false,
  children,
}) {
  return (
    <>
      <Header activeLink={activeLink} onSignOut={onSignOut} />
      <main
        className={styles.page}
        data-wide={wide ? 'true' : undefined}
        data-centered={centered ? 'true' : undefined}
        data-activity={activity ? 'true' : undefined}
      >
        {children}
      </main>
    </>
  )
}
