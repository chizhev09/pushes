import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { bootstrapTelegram } from './lib/telegram.ts'
import { setupBootTimeout, setupChunkReload } from './lib/boot-guard.ts'

setupChunkReload()
setupBootTimeout()

function BootFallback() {
  return (
    <div className="boot" role="status" aria-live="polite">
      <span className="boot__logo">Pushes</span>
      <span className="boot__spinner" aria-hidden />
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<BootFallback />}>
        <App />
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)

void bootstrapTelegram().catch(() => {
  /* обычный браузер */
})
