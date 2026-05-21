import { Route, Routes } from 'react-router-dom'
import Main from './components/pages/main/main.tsx'
import MainTasks from './components/pages/tasks/main_tasks.tsx'
import MainMenu from './components/pages/menu/main_menu.tsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/tasks" element={<MainTasks />} />
      <Route path="/menu" element={<MainMenu />} />
    </Routes>
  )
}
