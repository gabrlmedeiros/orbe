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
}

type TaskStore = {
  tasks: Task[]
  addTask: (payload: AddTaskPayload) => void
  updateTask: (id: string, patch: Partial<AddTaskPayload & { completed?: boolean; completedAt?: string | null }>) => void
  toggleComplete: (id: string) => void
  removeTask: (id: string) => void
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
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
              completed: false,
              completedAt: null,
              createdAt: new Date().toISOString(),
            },
          ],
        })),
          updateTask: (id, patch) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
      toggleComplete: (id) =>
        set((s) => ({ tasks: s.tasks.map((t) => {
          if (t.id !== id) return t
          const nextCompleted = !t.completed
          return { ...t, completed: nextCompleted, completedAt: nextCompleted ? new Date().toISOString() : null }
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
