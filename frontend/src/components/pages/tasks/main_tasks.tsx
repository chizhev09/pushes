import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageLayout from '../../layout/PageLayout.tsx'
import PageHeader from '../../layout/PageHeader.tsx'
import CardTask from './card_task.tsx'
import type { TaskItem, TaskTab } from './task-types.ts'
import './main_tasks.css'

const USER_TASKS: TaskItem[] = [
  {
    id: '1',
    url: 'instagram.com/reel/Cx9kLm2',
    status: 'pushing',
    actions: ['Посмотреть', 'Лайк'],
    reward: 14,
    progress: 62,
  },
  {
    id: '2',
    url: 'instagram.com/reel/Dm4pQr8',
    status: 'queued',
    actions: ['Подписаться', 'Коммент'],
    reward: 22,
  },
  {
    id: '3',
    url: 'instagram.com/reel/Ab2cDe5',
    status: 'queued',
    actions: ['Посмотреть', 'Сохранение'],
    reward: 11,
  },
]

const PLATFORM_TASKS: TaskItem[] = [
  {
    id: 'p1',
    url: 'instagram.com/reel/PushDaily01',
    status: 'queued',
    actions: ['Посмотреть', 'Лайк'],
    reward: 35,
  },
  {
    id: 'p2',
    url: 'instagram.com/reel/PushPromo42',
    status: 'queued',
    actions: ['Подписаться', 'Коммент', 'Сохранение'],
    reward: 48,
  },
  {
    id: 'p3',
    url: 'instagram.com/reel/PushBoost99',
    status: 'pushing',
    actions: ['Посмотреть', 'Лайк'],
    reward: 30,
    progress: 38,
  },
]

const TABS: { id: TaskTab; label: string }[] = [
  { id: 'users', label: 'От пользователей' },
  { id: 'platform', label: 'От платформы' },
]

const HINTS: Record<TaskTab, string> = {
  users: 'Нажми + внизу, чтобы добавить свой Reels в очередь',
  platform: 'Официальные задания Pushes — повышенная награда за выполнение',
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

function ReelIcon() {
  return (
    <svg
      className="tasks__reel-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <path d="M10 9v6l5-3-5-3z" fill="currentColor" stroke="none" />
    </svg>
  )
}

function shortenUrl(url: string) {
  if (url.length <= 36) return url
  return `${url.slice(0, 18)}…${url.slice(-12)}`
}

function TaskCard({
  task,
  isPlatform,
  onStart,
}: {
  task: TaskItem
  isPlatform: boolean
  onStart: (task: TaskItem) => void
}) {
  return (
    <li
      className={`tasks__card${isPlatform ? ' tasks__card--platform' : ''}`}
    >
      <div className="tasks__card-top">
        <span className="tasks__reels-label">Reels</span>
        {isPlatform && <span className="tasks__platform-badge">Pushes</span>}
        {task.status === 'pushing' && task.progress != null && (
          <div className="tasks__pushing-meta">
            <span className="tasks__status-dot" aria-hidden />
            <span className="tasks__progress-label">{task.progress}%</span>
          </div>
        )}
      </div>

      <div className="tasks__link-row">
        <span className="tasks__link-icon" aria-hidden>
          <ReelIcon />
        </span>
        <p className="tasks__url" title={task.url}>
          {shortenUrl(task.url)}
        </p>
      </div>

      {task.status === 'pushing' && task.progress != null && (
        <div className="tasks__progress" aria-hidden>
          <div
            className="tasks__progress-fill"
            style={{ width: `${task.progress}%` }}
          />
        </div>
      )}

      <div className="tasks__tags">
        {task.actions.map((label) => (
          <span key={label} className="tasks__tag">
            {label}
          </span>
        ))}
      </div>

      <div className="tasks__card-footer">
        <div className="tasks__economy">
          <span className="tasks__economy-label">Награда</span>
          <span className="tasks__economy-value tasks__economy-value--reward">
            <EnergyIcon size={13} />
            +{task.reward}
          </span>
        </div>

        {task.status === 'queued' ? (
          <motion.button
            type="button"
            className="tasks__start"
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            onClick={() => onStart(task)}
          >
            Начать
          </motion.button>
        ) : (
          <span className="tasks__start tasks__start--busy">Пушится…</span>
        )}
      </div>
    </li>
  )
}

export default function MainTasks() {
  const [tab, setTab] = useState<TaskTab>('users')
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null)
  const tasks = tab === 'users' ? USER_TASKS : PLATFORM_TASKS
  const isPlatform = tab === 'platform'

  return (
    <>
    <PageLayout hideDock={activeTask != null} glowVariant="tasks">
      <PageHeader />

      <section className="tasks">
        <div className="tasks__head">
          <h1 className="tasks__title">Задания</h1>
          <p className="tasks__desc">
            Выполняй задания — получай энергию и запускай пуш своих Reels.
          </p>
        </div>

        <div className="tasks__tabs" role="tablist" aria-label="Тип заданий">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              className={`tasks__tab${tab === id ? ' tasks__tab--active' : ''}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.ul
            key={tab}
            className="tasks__list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isPlatform={isPlatform}
                onStart={setActiveTask}
              />
            ))}
          </motion.ul>
        </AnimatePresence>

        <p className="tasks__hint">{HINTS[tab]}</p>
      </section>
    </PageLayout>

    <CardTask
      task={activeTask}
      isPlatform={isPlatform}
      onClose={() => setActiveTask(null)}
    />
    </>
  )
}
