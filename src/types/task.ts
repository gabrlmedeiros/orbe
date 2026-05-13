export type Task = {
  id: string
  title: string
  notes?: string
  priority: 'low' | 'medium' | 'high'
  dueAt?: string | null
  allDay?: boolean
  completed?: boolean
  completedAt?: string | null
  frequency?: 'none' | 'daily' | 'weekly' | 'custom'
  days?: number[]
  completedHistory?: Record<string, boolean>
  duration?: number | null
  createdAt: string
}