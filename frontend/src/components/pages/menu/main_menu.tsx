import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageLayout from '../../layout/PageLayout.tsx'
import PageHeader from '../../layout/PageHeader.tsx'
import './main_menu.css'

type MenuItem = {
  id: string
  label: string
  desc?: string
  to?: string
  icon: 'profile' | 'tasks' | 'energy' | 'help' | 'rules' | 'support'
  accent: string
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'profile',
    label: 'Профиль',
    desc: 'Статистика и настройки аккаунта',
    icon: 'profile',
    accent: '#6366f1',
  },
  {
    id: 'tasks',
    label: 'Мои задания',
    desc: 'Очередь пуша и выполнение',
    to: '/tasks',
    icon: 'tasks',
    accent: '#ea580c',
  },
  {
    id: 'energy',
    label: 'Купить энергию',
    desc: 'Пакеты и бонусы',
    icon: 'energy',
    accent: '#facc15',
  },
  {
    id: 'help',
    label: 'Как это работает',
    desc: 'Энергия, репутация, очередь',
    icon: 'help',
    accent: '#14b8a6',
  },
  {
    id: 'rules',
    label: 'Правила сервиса',
    icon: 'rules',
    accent: '#8b5cf6',
  },
  {
    id: 'support',
    label: 'Поддержка',
    desc: 'Написать в Telegram',
    icon: 'support',
    accent: '#ec4899',
  },
]

function MenuIcon({ type }: { type: MenuItem['icon'] }) {
  const props = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    'aria-hidden': true as const,
  }

  switch (type) {
    case 'profile':
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="4" />
          <path d="M6 20v-1.5a6 6 0 0112 0V20" strokeLinecap="round" />
        </svg>
      )
    case 'tasks':
      return (
        <svg {...props}>
          <path d="M8 8V6.5a4 4 0 118 0V8" strokeLinecap="round" />
          <path d="M6 8h12l-1.2 11H7.2L6 8z" strokeLinejoin="round" />
        </svg>
      )
    case 'energy':
      return (
        <svg {...props} fill="currentColor" stroke="none">
          <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
        </svg>
      )
    case 'help':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8h.01" strokeLinecap="round" strokeWidth="2" />
        </svg>
      )
    case 'rules':
      return (
        <svg {...props}>
          <path d="M8 6h12M8 12h12M8 18h8" strokeLinecap="round" />
          <path d="M4 6v12a2 2 0 002 2h0" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'support':
      return (
        <svg {...props}>
          <path
            d="M21 12a8 8 0 01-8 8H9l-4 3v-5.5A8 8 0 1112 4a8 8 0 019 8z"
            strokeLinejoin="round"
          />
        </svg>
      )
  }
}

function Chevron() {
  return (
    <svg
      className="menu__chevron"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MenuRow({ item }: { item: MenuItem }) {
  const content = (
    <>
      <span
        className="menu__icon"
        style={{ background: `${item.accent}18`, color: item.accent }}
      >
        <MenuIcon type={item.icon} />
      </span>
      <span className="menu__text">
        <span className="menu__label">{item.label}</span>
        {item.desc && <span className="menu__desc">{item.desc}</span>}
      </span>
      <Chevron />
    </>
  )

  const className = 'menu__item'

  if (item.to) {
    return (
      <Link to={item.to} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <motion.button
      type="button"
      className={className}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
    >
      {content}
    </motion.button>
  )
}

export default function MainMenu() {
  return (
    <PageLayout>
      <PageHeader />

      <section className="menu">
        <div className="menu__head">
          <h1 className="menu__title">Меню</h1>
          <p className="menu__subtitle">
            Профиль, энергия и настройки — всё в одном месте.
          </p>
        </div>

        <div className="menu__profile">
          <span className="menu__avatar" aria-hidden>
            P
          </span>
          <div className="menu__profile-info">
            <span className="menu__profile-name">Пользователь</span>
            <div className="menu__profile-stats">
              <span className="menu__stat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
                </svg>
                50
              </span>
              <span className="menu__stat-divider" aria-hidden />
              <span className="menu__stat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-3.31 0-6 1.57-6 3.5V20h12v-2.5c0-1.93-2.69-3.5-6-3.5z" />
                </svg>
                100%
              </span>
            </div>
          </div>
        </div>

        <nav className="menu__list" aria-label="Разделы меню">
          {MENU_ITEMS.map((item) => (
            <MenuRow key={item.id} item={item} />
          ))}
        </nav>

        <p className="menu__version">Pushes · v0.1</p>
      </section>
    </PageLayout>
  )
}
