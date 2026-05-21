import { Link, useLocation } from 'react-router-dom'

export default function DockNav() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const isTasks = pathname === '/tasks'
  const isMenu = pathname === '/menu'

  return (
    <nav className="main__dock" aria-label="Навигация">
      <Link
        to="/"
        className={`main__dock-btn${isHome ? ' main__dock-btn--active' : ''}`}
        aria-label="Добавить"
        aria-current={isHome ? 'page' : undefined}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      </Link>
      <Link
        to="/tasks"
        className={`main__dock-btn${isTasks ? ' main__dock-btn--active' : ''}`}
        aria-label="Задания"
        aria-current={isTasks ? 'page' : undefined}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M8 8V6.5a4 4 0 118 0V8" strokeLinecap="round" />
          <path d="M6 8h12l-1.2 11H7.2L6 8z" strokeLinejoin="round" />
        </svg>
      </Link>
      <Link
        to="/menu"
        className={`main__dock-btn${isMenu ? ' main__dock-btn--active' : ''}`}
        aria-label="Меню"
        aria-current={isMenu ? 'page' : undefined}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M5 9h14M5 15h14" strokeLinecap="round" />
        </svg>
      </Link>
    </nav>
  )
}
