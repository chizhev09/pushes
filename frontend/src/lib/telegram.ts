declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        expand: () => void
        close: () => void
        disableVerticalSwipes?: () => void
        requestFullscreen?: () => void
        initData: string
        initDataUnsafe: { user?: { id: number; username?: string; first_name?: string } }
        colorScheme: 'light' | 'dark'
        themeParams: Record<string, string>
        platform: string
        isExpanded: boolean
        viewportHeight: number
        viewportStableHeight: number
      }
    }
  }
}

export function isTelegramMiniApp() {
  return Boolean(window.Telegram?.WebApp?.initData)
}

/** Подготовка Mini App: ready + на весь экран по высоте и ширине в WebView */
export function initTelegramApp() {
  const tg = window.Telegram?.WebApp
  if (!tg) return false

  tg.ready()
  tg.expand()

  if (typeof tg.disableVerticalSwipes === 'function') {
    tg.disableVerticalSwipes()
  }

  // Полноэкранный режим в новых клиентах Telegram (опционально)
  if (typeof tg.requestFullscreen === 'function') {
    try {
      tg.requestFullscreen()
    } catch {
      /* старые клиенты */
    }
  }

  document.documentElement.classList.add('tg-app')

  const setViewportVars = () => {
    document.documentElement.style.setProperty(
      '--tg-viewport-height',
      `${tg.viewportStableHeight || tg.viewportHeight}px`,
    )
  }

  setViewportVars()
  window.addEventListener('resize', setViewportVars)

  return true
}

export {}
