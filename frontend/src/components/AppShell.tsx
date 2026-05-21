import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

/** Снимает HTML-загрузчик только когда React реально отрисовал страницу */
export default function AppShell() {
  useEffect(() => {
    document.documentElement.classList.add('app-ready')
    document.getElementById('boot')?.remove()
  }, [])

  return <Outlet />
}
