import { DEMO_MODE } from '@/config/env'
import { demoTasks } from '@/mocks/demoData'
import { Task } from '@/types/task'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AddTaskPayload = {
  title: string
  notes?: string
  priority?: 'low' | 'medium' | 'high'
  dueAt?: string | null
  allDay?: boolean
  duration?: number | null
  frequency?: 'none' | 'daily' | 'weekly' | 'custom'
  days?: number[]
}

type TaskStore = {
  tasks: Task[]
  addTask: (payload: AddTaskPayload) => void
  updateTask: (id: string, patch: Partial<Task>) => void
  toggleComplete: (id: string) => void
  removeTask: (id: string) => void
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: DEMO_MODE ? demoTasks : [],
      addTask: (payload) =>
        set((s) => ({
          tasks: [
            ...s.tasks,
            {
              id: Math.random().toString(36).slice(2),
              title: payload.title,
              notes: payload.notes,
              priority: payload.priority ?? 'medium',
              dueAt: payload.dueAt ?? null,
              allDay: payload.allDay ?? false,
              duration: payload.duration ?? null,
              frequency: payload.frequency ?? 'none',
              days: payload.days,
              completed: false,
              completedAt: null,
              completedHistory: {},
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateTask: (id, patch) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
      toggleComplete: (id) =>
        set((s) => ({ tasks: s.tasks.map((t) => {
          if (t.id !== id) return t
          try {
            const { localIso } = require('@/utils/date')
            const iso = localIso()
            const history = { ...(t.completedHistory ?? {}) }
            const currentlyDone = !!history[iso]
            if (currentlyDone) delete history[iso]
            else history[iso] = true
            const nextCompleted = Object.keys(history).length > 0 ? !!history[Object.keys(history).slice(-1)[0]] : false
            return { ...t, completed: nextCompleted, completedAt: currentlyDone ? null : new Date().toISOString(), completedHistory: history }
          } catch (e) {
            const nextCompleted = !t.completed
            return { ...t, completed: nextCompleted, completedAt: nextCompleted ? new Date().toISOString() : null }
          }
        }) })),
      removeTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
    }),
    {
      name: 'task-storage',
      storage: {
        getItem: async (name: string) => {
          const s = await AsyncStorage.getItem(name)
          return s ? JSON.parse(s) : null
        },
        setItem: async (name: string, value: any) => {
          await AsyncStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: async (name: string) => {
          await AsyncStorage.removeItem(name)
        },
      },
    }
  )
)
