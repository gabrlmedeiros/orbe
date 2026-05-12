export type Habit = {
  id: string
  title: string
  icon: string
  color: string
  category?: string

  frequency: 'daily' | 'weekly' | 'custom'
  days?: number[] // [1,2,3]

  goal?: {
    value: number
    unit: string
  }

  streak: number
  bestStreak: number

  completed?: { [isoDate: string]: number }

  createdAt: string
}