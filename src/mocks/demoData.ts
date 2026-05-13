import { Habit } from "@/types/habit"
import { Task } from "@/types/task"

const today = new Date().toISOString().split('T')[0]

export const demoHabits: Habit[] = [
  {
    id: '1',
    title: 'Beber água',
    icon: 'water',
    color: '#3B82F6',
    frequency: 'daily',
    goal: { value: 2, unit: 'L' },
    streak: 12,
    bestStreak: 20,
    completed: {
      [today]: 1.5
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Treinar',
    icon: 'dumbbell',
    color: '#EF4444',
    frequency: 'weekly',
    days: [1, 3, 5],
    streak: 5,
    bestStreak: 10,
    completed: {
      [today]: 1
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Ler',
    icon: 'book-open',
    color: '#10B981',
    frequency: 'daily',
    goal: { value: 20, unit: 'min' },
    streak: 30,
    bestStreak: 45,
    completed: {
      [today]: 20
    },
    createdAt: new Date().toISOString()
  }
,
  (() => {
    const id = 'demo-history'
    const title = 'Meditar (demo)'
    const days = 90
    const history: { [k: string]: number } = {}
    for (let i = 0; i < days; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const iso = d.toISOString().split('T')[0]
      history[iso] = i % 7 === 0 ? 0 : 1
    }

    let streak = 0
    for (let i = 0; i < days; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const iso = d.toISOString().split('T')[0]
      if (history[iso] && history[iso] > 0) streak++
      else break
    }

    return {
      id,
      title,
      icon: 'bolt',
      color: '#8B5CF6',
      frequency: 'daily',
      goal: { value: 1, unit: 'session' },
      streak,
      bestStreak: 28,
      completed: history,
      createdAt: new Date().toISOString()
    }
  })()
]

export const demoTasks: Task[] = [
  {
    id: '1',
    title: 'Revisar código',
    priority: 'high',
    frequency: 'daily',
    completed: false,
    completedHistory: {
      [today]: false
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Planejar dia',
    priority: 'medium',
    frequency: 'none',
    completed: true,
    completedAt: new Date().toISOString(),
    completedHistory: {
      [today]: true
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Responder mensagens',
    priority: 'low',
    frequency: 'none',
    completed: false,
    completedHistory: {},
    createdAt: new Date().toISOString()
  }
]