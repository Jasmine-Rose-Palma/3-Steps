import { Link, useNavigate } from 'react-router-dom'
import Button from '../../atoms/Button/Button.jsx'
import styles from './Header.module.css'

export default function Header({ activeLink, onSignOut }) {
  const navigate = useNavigate()
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link
          to="/"
          className={styles.logo}
          aria-label="3 Steps home"
          aria-current={activeLink === 'home' ? 'page' : undefined}
        >
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="" className={styles.logoImage} />
        </Link>
        <div className={styles.actions}>
          <nav aria-label="Main">
            <Button
              variant="dark"
              size="nav"
              aria-current={activeLink === 'progress' ? 'page' : undefined}
              onClick={() => navigate('/progress')}
            >
              Progress
            </Button>
          </nav>
          {onSignOut && (
            <Button variant="maroon" style="outline" size="nav" onClick={onSignOut}>
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
