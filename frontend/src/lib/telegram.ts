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

export function isTelegramMiniApp() {
  return Boolean(window.Telegram?.WebApp?.initData)
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

/** Подготовка Mini App: viewport Telegram + safe area, без requestFullscreen */
export function initTelegramApp() {
  const tg = window.Telegram?.WebApp
  if (!tg) return false

  tg.ready()
  tg.expand()

  if (typeof tg.disableVerticalSwipes === 'function') {
    tg.disableVerticalSwipes()
  }

  tg.setHeaderColor?.('#ffffff')
  tg.setBackgroundColor?.('#ffffff')

  document.documentElement.classList.add('tg-app')

  const setViewportVars = () => {
    const h = tg.viewportStableHeight || tg.viewportHeight
    document.documentElement.style.setProperty('--tg-viewport-height', `${h}px`)
    applySafeArea(tg)
  }

  setViewportVars()

  const onViewport = () => setViewportVars()
  tg.onEvent?.('viewportChanged', onViewport)
  window.addEventListener('resize', onViewport)

  return true
}

export {}
