export type Task = {
  id: string
  title: string
  notes?: string
  priority: 'low' | 'medium' | 'high'
  dueAt?: string | null
  allDay?: boolean
  completed?: boolean
  completedAt?: string | null
  duration?: number | null
  createdAt: string
}