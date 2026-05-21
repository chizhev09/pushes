import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell.tsx'

const Main = lazy(() => import('./components/pages/main/main.tsx'))
const MainTasks = lazy(() => import('./components/pages/tasks/main_tasks.tsx'))
const MainMenu = lazy(() => import('./components/pages/menu/main_menu.tsx'))

function PageFallback() {
  return (
    <div className="boot boot--inline" role="status" aria-live="polite">
      <span className="boot__logo">Pushes</span>
      <span className="boot__spinner" aria-hidden />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Main />} />
          <Route path="/tasks" element={<MainTasks />} />
          <Route path="/menu" element={<MainMenu />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
