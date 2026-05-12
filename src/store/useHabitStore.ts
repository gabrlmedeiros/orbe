import { COLOR_PALETTE } from '@/constants/theme'
import { Habit } from '@/types/habit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AddHabitPayload = {
  title: string
  icon: string
  color?: string
  category?: string
  frequency?: 'daily' | 'weekly' | 'custom'
  days?: number[]
  goal?: { value: number; unit: string }
}

type HabitStore = {
  habits: Habit[]
  addHabit: (payload: AddHabitPayload) => void
  updateHabit: (id: string, payload: Partial<AddHabitPayload>) => void
  setCompletion: (id: string, dateIso: string, amount: number) => void
  removeHabit: (id: string) => void
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set) => ({
      habits: [],

      addHabit: (payload) =>
        set((state) => ({
          habits: [
            ...state.habits,
            {
              id: Math.random().toString(),
              title: payload.title,
              icon: payload.icon,
              color: payload.color ?? COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)],
              category: payload.category,
              frequency: payload.frequency ?? 'daily',
              days: payload.days,
              goal: payload.goal,
              streak: 0,
              bestStreak: 0,
              createdAt: new Date().toISOString(),
              completed: {},
            },
          ],
        })),
      updateHabit: (id, payload) =>
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...payload } : h)),
        })),
      setCompletion: (id, dateIso, amount) =>
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== id) return h
            const next = { ...(h.completed ?? {}) }
            if (amount > 0) next[dateIso] = amount
            else delete next[dateIso]

            const dates = Object.keys(next).sort()

            const toDay = (iso: string) => new Date(iso + 'T00:00:00').getTime()

            const isScheduledOn = (habit: Habit, iso: string) => {
              if (!habit.frequency || habit.frequency === 'daily') return true
              const d = new Date(iso + 'T00:00:00')
              const wd = d.getDay() === 0 ? 7 : d.getDay()
              if (habit.frequency === 'weekly') {
                try {
                  const createdWd = new Date(habit.createdAt).getDay() === 0 ? 7 : new Date(habit.createdAt).getDay()
                  return createdWd === wd
                } catch (e) {
                  return true
                }
              }
              if (habit.frequency === 'custom' && Array.isArray(habit.days)) {
                return habit.days.includes(wd)
              }
              return true
            }

            const prevScheduledTimestamp = (habit: Habit, iso: string) => {
              const DAY = 24 * 3600 * 1000
              const t = toDay(iso)
              if (!habit.frequency || habit.frequency === 'daily') return t - DAY
              if (habit.frequency === 'weekly') return t - 7 * DAY
              for (let i = 1; i <= 7; i++) {
                const prev = new Date(t - i * DAY)
                const isoPrev = require('@/utils/date').localIso(prev)
                if (isScheduledOn(habit, isoPrev)) return toDay(isoPrev)
              }
              return t - DAY
            }

            let best = 0
            let currentRun = 0
            let prevTs = -1
            for (let i = 0; i < dates.length; i++) {
              const iso = dates[i]
              const t = toDay(iso)
              if (prevTs === -1) {
                currentRun = 1
              } else {
                const expectedPrev = prevScheduledTimestamp(h, iso)
                if (expectedPrev === prevTs) currentRun += 1
                else currentRun = 1
              }
              if (currentRun > best) best = currentRun
              prevTs = t
            }

            const { localIso } = require('@/utils/date')
            const todayIso = localIso()
            const findMostRecentScheduled = () => {
              const DAY = 24 * 3600 * 1000
              let cursor = new Date(todayIso + 'T00:00:00').getTime()
              for (let i = 0; i < 366; i++) {
                const iso = require('@/utils/date').localIso(new Date(cursor - i * DAY))
                if (isScheduledOn(h, iso)) return iso
              }
              return todayIso
            }

            let streak = 0
            let cursorIso = findMostRecentScheduled()
            while (true) {
              if (next[cursorIso]) streak += 1
              else break
              const prevTsScheduled = prevScheduledTimestamp(h, cursorIso)
              const prevIso = require('@/utils/date').localIso(new Date(prevTsScheduled))
              cursorIso = prevIso
            }

            return { ...h, completed: next, streak, bestStreak: best }
          }),
        })),
      removeHabit: (id) => set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),
    }),
    {
      name: 'habit-storage',
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
