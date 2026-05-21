/** После деплоя старый index.html может ссылаться на удалённые чанки — перезагрузка */
export function setupChunkReload() {
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault()
    const key = 'pushes-chunk-reload'
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, '1')
      window.location.reload()
      return
    }
    sessionStorage.removeItem(key)
  })

  window.addEventListener('unhandledrejection', (event) => {
    const msg = String(event.reason ?? '')
    if (msg.includes('Failed to fetch dynamically imported module')) {
      event.preventDefault()
      window.location.reload()
    }
  })
}

/** Если JS так и не стартовал — подсказка пользователю */
export function setupBootTimeout(ms = 18_000) {
  window.setTimeout(() => {
    if (document.documentElement.classList.contains('app-ready')) return
    const boot = document.getElementById('boot')
    if (!boot) return
    boot.innerHTML = `
      <span class="boot__logo">Pushes</span>
      <p style="margin:0;font-size:14px;color:#5c5c66;text-align:center;max-width:260px">
        Долго грузится. Нажми обновить или проверь сеть.
      </p>
      <button type="button" onclick="location.reload()" style="
        margin-top:8px;padding:12px 24px;border:none;border-radius:999px;
        background:#ff6b00;color:#fff;font-size:15px;font-weight:600;cursor:pointer
      ">Обновить</button>
    `
  }, ms)
}
