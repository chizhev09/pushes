import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { TaskItem } from './task-types.ts'
import './card_task.css'

type CardTaskProps = {
  task: TaskItem | null
  isPlatform: boolean
  onClose: () => void
  onComplete?: (task: TaskItem) => void
}

type ScreenshotItem = {
  id: string
  file: File
  url: string
}

function EnergyIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  )
}

function toFullUrl(url: string) {
  return url.startsWith('http') ? url : `https://${url}`
}

export default function CardTask({
  task,
  isPlatform,
  onClose,
  onComplete,
}: CardTaskProps) {
  const open = task != null
  const uploadId = useId()
  const fileRef = useRef<HTMLInputElement>(null)
  const [screenshots, setScreenshots] = useState<ScreenshotItem[]>([])
  const canCheck = screenshots.length > 0

  useEffect(() => {
    setScreenshots((prev) => {
      prev.forEach((s) => URL.revokeObjectURL(s.url))
      return []
    })
  }, [task?.id])

  useEffect(() => {
    if (!open) {
      setScreenshots((prev) => {
        prev.forEach((s) => URL.revokeObjectURL(s.url))
        return []
      })
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const addScreenshots = (files: FileList | null) => {
    if (!files?.length) return
    const images = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (!images.length) return

    const items: ScreenshotItem[] = images.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      url: URL.createObjectURL(file),
    }))
    setScreenshots((prev) => [...prev, ...items])
    if (fileRef.current) fileRef.current.value = ''
  }

  const removeScreenshot = (id: string) => {
    setScreenshots((prev) => {
      const item = prev.find((s) => s.id === id)
      if (item) URL.revokeObjectURL(item.url)
      return prev.filter((s) => s.id !== id)
    })
  }

  const overlay = (
    <AnimatePresence>
      {task && (
        <motion.div
          className="card-task"
          role="dialog"
          aria-modal="true"
          aria-labelledby="card-task-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <motion.div
            className="card-task__screen"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="card-task__top">
              <div className="card-task__header-left">
                <span className="card-task__reels" id="card-task-title">
                  Reels
                </span>
                {isPlatform && (
                  <span className="card-task__badge">Pushes</span>
                )}
              </div>
              <button
                type="button"
                className="card-task__close"
                aria-label="Закрыть"
                onClick={onClose}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            <div className="card-task__body">
              <p className="card-task__subtitle">
                Выполни действия в Instagram и прикрепи скриншоты — энергия
                начислится после проверки.
              </p>

              <a
                href={toFullUrl(task.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="card-task__open"
              >
                <span className="card-task__open-icon" aria-hidden>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  >
                    <rect x="4" y="4" width="16" height="16" rx="4" />
                    <path
                      d="M10 9v6l5-3-5-3z"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>
                </span>
                <span className="card-task__open-text">
                  <span className="card-task__open-label">Открыть Reels</span>
                  <span className="card-task__open-url">{task.url}</span>
                </span>
                <svg
                  className="card-task__open-arrow"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path
                    d="M7 17L17 7M17 7H9M17 7v8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              <div className="card-task__section">
                <h2 className="card-task__section-title">Что сделать</h2>
                <ul className="card-task__actions">
                  {task.actions.map((action, i) => (
                    <li key={action} className="card-task__action">
                      <span className="card-task__action-num">{i + 1}</span>
                      <span className="card-task__action-label">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-task__reward">
                <span className="card-task__reward-label">
                  Награда за выполнение
                </span>
                <span className="card-task__reward-value">
                  <EnergyIcon size={16} />
                  +{task.reward}
                </span>
              </div>

              <div className="card-task__section card-task__section--confirm">
                <h2 className="card-task__section-title">Подтверждение</h2>
                <p className="card-task__upload-hint">
                  Загрузи скриншоты из Instagram — лайк, коммент, подписка и т.д.
                </p>

                <input
                  ref={fileRef}
                  id={uploadId}
                  type="file"
                  className="card-task__file-input"
                  accept="image/*"
                  multiple
                  onChange={(e) => addScreenshots(e.target.files)}
                />

                <label htmlFor={uploadId} className="card-task__upload">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    aria-hidden
                  >
                    <rect x="3" y="5" width="18" height="14" rx="3" />
                    <circle cx="8.5" cy="10.5" r="1.5" fill="currentColor" stroke="none" />
                    <path d="M3 16l5-5 4 4 3-3 6 6" strokeLinejoin="round" />
                  </svg>
                  <span className="card-task__upload-label">
                    Добавить скриншоты
                  </span>
                  <span className="card-task__upload-meta">PNG, JPG · несколько файлов</span>
                </label>

                {screenshots.length > 0 && (
                  <ul className="card-task__previews" aria-label="Загруженные скриншоты">
                    {screenshots.map((shot) => (
                      <li key={shot.id} className="card-task__preview">
                        <img src={shot.url} alt="" />
                        <button
                          type="button"
                          className="card-task__preview-remove"
                          aria-label="Удалить скриншот"
                          onClick={() => removeScreenshot(shot.id)}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden
                          >
                            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <motion.button
                  type="button"
                  className="card-task__check"
                  disabled={!canCheck}
                  whileHover={canCheck ? { scale: 1.015 } : undefined}
                  whileTap={canCheck ? { scale: 0.94 } : undefined}
                  transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                  onClick={() => {
                    if (!canCheck) return
                    onComplete?.(task)
                    onClose()
                  }}
                >
                  Проверить
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return createPortal(overlay, document.body)
}
