import { setupBootTimeout, setupChunkReload } from './lib/boot-guard.ts'

setupChunkReload()
setupBootTimeout()

/**
 * Точка входа минимальная: не тянет React сразу.
 * На мобилке modulepreload грузил react+router параллельно и «вешал» WebView.
 */
async function start() {
  const { mountApp } = await import('./bootstrap.tsx')
  mountApp()
}

void start().catch(() => {
  const boot = document.getElementById('boot')
  if (!boot) return
  boot.innerHTML = `
    <span class="boot__logo">Pushes</span>
    <p style="margin:0;font-size:14px;color:#5c5c66;text-align:center;max-width:260px">
      Не удалось загрузить приложение.
    </p>
    <button type="button" onclick="location.reload()" style="
      margin-top:8px;padding:12px 24px;border:none;border-radius:999px;
      background:#ff6b00;color:#fff;font-size:15px;font-weight:600;cursor:pointer
    ">Обновить</button>
  `
})
