declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        expand: () => void
        close: () => void
        disableVerticalSwipes?: () => void
        setHeaderColor?: (color: string) => void
        setBackgroundColor?: (color: string) => void
        onEvent?: (event: string, callback: () => void) => void
        offEvent?: (event: string, callback: () => void) => void
        initData: string
        initDataUnsafe: { user?: { id: number; username?: string; first_name?: string } }
        colorScheme: 'light' | 'dark'
        themeParams: Record<string, string>
        platform: string
        isExpanded: boolean
        viewportHeight: number
        viewportStableHeight: number
        safeAreaInset?: { top: number; bottom: number; left: number; right: number }
        contentSafeAreaInset?: { top: number; bottom: number; left: number; right: number }
      }
    }
  }
}

const TG_SCRIPT = 'https://telegram.org/js/telegram-web-app.js'

export function isTelegramMiniApp() {
  return Boolean(window.Telegram?.WebApp?.initData)
}

function viewportHeightPx(tg: NonNullable<typeof window.Telegram>['WebApp']) {
  const fromTg = tg.viewportStableHeight || tg.viewportHeight || 0
  return Math.max(fromTg, window.innerHeight, 320)
}

function applySafeArea(tg: NonNullable<typeof window.Telegram>['WebApp']) {
  const content = tg.contentSafeAreaInset ?? tg.safeAreaInset
  const safe = tg.safeAreaInset

  if (content) {
    document.documentElement.style.setProperty('--tg-content-top', `${content.top}px`)
    document.documentElement.style.setProperty('--tg-content-bottom', `${content.bottom}px`)
  }
  if (safe) {
    document.documentElement.style.setProperty('--tg-safe-top', `${safe.top}px`)
    document.documentElement.style.setProperty('--tg-safe-bottom', `${safe.bottom}px`)
    document.documentElement.style.setProperty('--tg-safe-left', `${safe.left}px`)
    document.documentElement.style.setProperty('--tg-safe-right', `${safe.right}px`)
  }
}

function bindTelegramLayout(tg: NonNullable<typeof window.Telegram>['WebApp']) {
  tg.ready()
  tg.expand()

  if (typeof tg.disableVerticalSwipes === 'function') {
    tg.disableVerticalSwipes()
  }

  tg.setHeaderColor?.('#ffffff')
  tg.setBackgroundColor?.('#ffffff')

  document.documentElement.classList.add('tg-app')

  const setViewportVars = () => {
    document.documentElement.style.setProperty(
      '--tg-viewport-height',
      `${viewportHeightPx(tg)}px`,
    )
    applySafeArea(tg)
  }

  setViewportVars()
  tg.onEvent?.('viewportChanged', setViewportVars)
  window.addEventListener('resize', setViewportVars)
}

/** Скрипт Telegram не блокирует первый экран — подгружается после старта приложения */
export async function bootstrapTelegram() {
  if (!window.Telegram?.WebApp) {
    await new Promise<void>((resolve, reject) => {
      const existing = document.querySelector(`script[src="${TG_SCRIPT}"]`)
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true })
        existing.addEventListener('error', () => reject(), { once: true })
        return
      }
      const script = document.createElement('script')
      script.src = TG_SCRIPT
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('telegram-web-app.js failed'))
      document.head.appendChild(script)
    })
  }

  const tg = window.Telegram?.WebApp
  if (!tg?.initData) return false

  bindTelegramLayout(tg)
  return true
}
