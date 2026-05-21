import { useEffect, useState } from 'react'
import PageLayout from '../../layout/PageLayout.tsx'
import PageHeader from '../../layout/PageHeader.tsx'
import './main.css'

type ValidateStatus = 'idle' | 'loading' | 'valid' | 'invalid'

type TaskActions = {
  subscribe: boolean
  view: boolean
  like: boolean
  comment: boolean
  commentLike: boolean
  commentReply: boolean
  save: boolean
}

const TASK_OPTIONS: { key: keyof TaskActions; label: string; cost: number }[] = [
  { key: 'view', label: 'Посмотреть', cost: 2 },
  { key: 'subscribe', label: 'Подписаться', cost: 5 },
  { key: 'like', label: 'Лайк', cost: 3 },
  { key: 'comment', label: 'Коммент', cost: 4 },
  { key: 'commentLike', label: 'Лайк на коммент', cost: 1 },
  { key: 'commentReply', label: 'Ответ на коммент', cost: 2 },
  { key: 'save', label: 'Сохранение', cost: 2 },
]

const DEFAULT_ACTIONS: TaskActions = {
  subscribe: false,
  view: true,
  like: false,
  comment: false,
  commentLike: false,
  commentReply: false,
  save: false,
}

function isValidReelUrl(raw: string) {
  try {
    const u = new URL(raw.startsWith('http') ? raw : `https://${raw}`)
    const host = u.hostname.replace('www.', '')
    const okHost = host === 'instagram.com' || host.endsWith('.instagram.com')
    const okPath =
      u.pathname.startsWith('/reel/') ||
      u.pathname.startsWith('/reels/') ||
      u.pathname.startsWith('/p/')
    return okHost && okPath && u.pathname.length > 3
  } catch {
    return false
  }
}

function FieldSpinner() {
  return <span className="main__field-spinner" aria-hidden />
}

function FieldCheck() {
  return (
    <svg
      className="main__field-check"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden
    >
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Main() {
  const [link, setLink] = useState('')
  const [done, setDone] = useState(false)
  const [validateStatus, setValidateStatus] = useState<ValidateStatus>('idle')
  const [validateMsg, setValidateMsg] = useState('')
  const [actions, setActions] = useState<TaskActions>(DEFAULT_ACTIONS)

  useEffect(() => {
    const value = link.trim()

    if (!value) {
      setValidateStatus('idle')
      setValidateMsg('')
      setActions(DEFAULT_ACTIONS)
      return
    }

    setValidateStatus('loading')
    setValidateMsg('')

    const timer = window.setTimeout(() => {
      if (isValidReelUrl(value)) {
        setValidateStatus('valid')
        setValidateMsg('')
      } else {
        setValidateStatus('invalid')
        setValidateMsg('Ссылка должна быть на Reels: instagram.com/reel/…')
      }
    }, 650)

    return () => window.clearTimeout(timer)
  }, [link])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = link.trim()
    if (!value) return

    setLink('')
    setValidateStatus('idle')
    setValidateMsg('')
    setActions(DEFAULT_ACTIONS)
    setDone(true)
    setTimeout(() => setDone(false), 2200)
  }

  const showIndicator = validateStatus === 'loading' || validateStatus === 'valid'

  const toggleAction = (key: keyof TaskActions) => {
    setActions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <PageLayout>
      <PageHeader />

      <section className="main__hero">
          <h1 className="main__title">
            Добавь Reels
            <br />
            в очередь пуша
          </h1>
          <p className="main__desc">
            Вставь ссылку и нажми кнопку — рилс появится в заданиях и начнёт
            пушиться автоматически.
          </p>

          <form
            className={`main__form${validateStatus !== 'valid' ? ' main__form--tight' : ''}`}
            onSubmit={handleSubmit}
          >
            <span className="main__field-label">Ссылка на Reels</span>

            <div
              className={`main__field-block${validateStatus === 'valid' ? ' main__field-block--expanded' : ' main__field-block--compact'}`}
            >
              <div
                className={`main__field${validateStatus === 'invalid' ? ' main__field--error' : ''}${validateStatus === 'valid' ? ' main__field--valid' : ''}`}
              >
                <input
                  type="url"
                  placeholder="instagram.com/reel/…"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  aria-label="Ссылка на Reels"
                  aria-invalid={validateStatus === 'invalid'}
                  className={showIndicator ? 'main__field-input--pad' : ''}
                />
                <div className="main__field-indicator" aria-live="polite">
                  {validateStatus === 'loading' && (
                    <span className="main__field-indicator-inner main__fade-in">
                      <FieldSpinner />
                    </span>
                  )}
                  {validateStatus === 'valid' && (
                    <span className="main__field-indicator-inner main__fade-in">
                      <FieldCheck />
                    </span>
                  )}
                </div>
              </div>

              {(validateStatus === 'loading' || validateStatus === 'invalid') && (
                <div className="main__validate-slot main__expand-open">
                  {validateStatus === 'loading' && (
                    <p className="main__validate-text main__validate-text--loading">
                      Проверяем ссылку…
                    </p>
                  )}
                  {validateStatus === 'invalid' && (
                    <p className="main__validate-text main__validate-text--error">
                      {validateMsg}
                    </p>
                  )}
                </div>
              )}

              {validateStatus === 'valid' && (
                <div className="main__task-settings main__expand-open main__task-settings--open">
                  <p className="main__task-settings-title">Настройки задания:</p>
                  <div className="main__task-options">
                    {TASK_OPTIONS.map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        className={`main__task-option${actions[opt.key] ? ' main__task-option--on' : ''}`}
                        onClick={() => toggleAction(opt.key)}
                        aria-pressed={actions[opt.key]}
                      >
                        <span>{opt.label}</span>
                        <span className="main__task-option-cost">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden
                          >
                            <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
                          </svg>
                          {opt.cost}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`main__submit${done ? ' main__submit--ok' : ''}`}
            >
              {done ? 'Добавлено ✓' : 'Добавить в задания →'}
            </button>

            <p className="main__note">
              * Деятельность Meta Platforms Inc. (соцсети Facebook и Instagram)
              запрещена на территории Российской Федерации
            </p>
          </form>
      </section>
    </PageLayout>
  )
}
