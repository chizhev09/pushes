import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

function PersonIcon() {
  return (
    <svg
      className="main__reputation-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-3.31 0-6 1.57-6 3.5V20h12v-2.5c0-1.93-2.69-3.5-6-3.5z" />
    </svg>
  )
}

export default function PageHeader() {
  const { pathname } = useLocation()
  const showReputation = pathname === '/tasks'

  return (
    <div className="main__top">
      <span className="main__logo">Pushes</span>
      <div className="main__top-pills">
        <AnimatePresence mode="popLayout">
          {showReputation && (
            <motion.div
              key="reputation"
              className="main__reputation"
              aria-label="Репутация: 100%"
              initial={{ opacity: 0, scale: 0.82, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.82, x: 10 }}
              transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              layout
            >
              <PersonIcon />
              <span className="main__reputation-value">100%</span>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className="main__energy"
          aria-label="Энергия: 50"
          layout
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
        >
          <svg
            className="main__energy-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
          </svg>
          <span className="main__energy-value">50</span>
        </motion.div>
      </div>
    </div>
  )
}
