export type TaskStatus = 'pushing' | 'queued'
export type TaskTab = 'users' | 'platform'

export type TaskItem = {
  id: string
  url: string
  status: TaskStatus
  actions: string[]
  reward: number
  progress?: number
}
