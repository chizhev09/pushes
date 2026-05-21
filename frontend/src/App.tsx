import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

const Main = lazy(() => import('./components/pages/main/main.tsx'))
const MainTasks = lazy(() => import('./components/pages/tasks/main_tasks.tsx'))
const MainMenu = lazy(() => import('./components/pages/menu/main_menu.tsx'))

function PageFallback() {
  return <div className="boot boot--inline" aria-hidden />
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/tasks" element={<MainTasks />} />
        <Route path="/menu" element={<MainMenu />} />
      </Routes>
    </Suspense>
  )
}
