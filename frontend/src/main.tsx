import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { bootstrapTelegram } from './lib/telegram.ts'

function BootFallback() {
  return (
    <div className="boot" role="status" aria-live="polite">
      <span className="boot__logo">Pushes</span>
      <span className="boot__spinner" aria-hidden />
    </div>
  )
}

const rootEl = document.getElementById('root')!

createRoot(rootEl).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<BootFallback />}>
        <App />
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)

document.documentElement.classList.add('app-ready')
document.getElementById('boot')?.remove()

void bootstrapTelegram().catch(() => {
  /* обычный браузер — без Mini App */
})
