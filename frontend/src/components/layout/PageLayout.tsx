import type { ReactNode } from 'react'
import DockNav from './DockNav.tsx'
import './page-layout.css'

type PageLayoutProps = {
  children: ReactNode
  hideDock?: boolean
  glowVariant?: 'home' | 'tasks'
}

export default function PageLayout({
  children,
  hideDock,
  glowVariant = 'home',
}: PageLayoutProps) {
  const isTasksGlow = glowVariant === 'tasks'

  return (
    <div className={`main${isTasksGlow ? ' main--tasks-glow' : ''}`}>
      <div className="main__inner">{children}</div>
      {!hideDock && <DockNav />}
    </div>
  )
}
