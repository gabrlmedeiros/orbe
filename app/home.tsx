import Fab from '@/components/Fab'
import Screen from '@/components/Screen'
import TopBar from '@/components/TopBar'
import HabitItem from '@/components/ui/habit-item'
import TaskItem from '@/components/ui/task-item'
import { t } from '@/i18n'
import { useTheme } from '@/providers/ThemeProvider'
import { useHabitStore } from '@/store/useHabitStore'
import { useTaskStore } from '@/store/useTaskStore'
import { localIso } from '@/utils/date'
import { sortTasks } from '@/utils/sortTasks'
import { showToast } from '@/utils/toastService'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function isoDate(dateString: string) {
  return dateString.split('T')[0]
}

export default function Home() {
  const habits = useHabitStore((s) => s.habits)
  const setCompletion = useHabitStore((s) => s.setCompletion)
  const navigation = useNavigation()
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()

  const today = localIso()

  function isDueToday(h: any) {
    if (h.frequency === 'daily') return true
    if (h.frequency === 'custom' && Array.isArray(h.days)) {
      const wd = new Date().getDay()
      const dayNum = wd === 0 ? 7 : wd
      return h.days.includes(dayNum)
    }
    if (h.frequency === 'weekly') {
      try {
        const wd = new Date(h.createdAt).getDay()
        const dayNum = wd === 0 ? 7 : wd
        const todayWd = new Date().getDay()
        const todayNum = todayWd === 0 ? 7 : todayWd
        return dayNum === todayNum
      } catch (e) {
        return true
      }
    }
    return true
  }

  const todays = habits.filter((h) => isDueToday(h) && !(h.completed?.[today]))
  const tasks = useTaskStore((s) => s.tasks)
  const toggleTask = useTaskStore((s) => s.toggleComplete)

  const todaysTasksRaw = tasks.filter((t) => {
    if (t.completed) return false
    if (!t.dueAt) return true
    try {
      return isoDate(t.dueAt) === today
    } catch (e) {
      return false
    }
  })

  const todaysTasks = sortTasks(todaysTasksRaw)
  const bothEmpty = todays.length === 0 && todaysTasks.length === 0
  const [showFabMenu, setShowFabMenu] = React.useState(false)
  const [showCompletedToday, setShowCompletedToday] = React.useState(false)
  const completedHabits = habits.filter((h) => !!(h.completed && h.completed[today]))
  const completedTasks = tasks.filter((t) => {
    if (!t.completed || !t.completedAt) return false
    try {
      return require('@/utils/date').localIso(new Date(t.completedAt)) === today
    } catch (e) {
      return false
    }
  })
  const completedCount = completedHabits.length + completedTasks.length

  return (
    <Screen>
      <TopBar />
      <View style={{ paddingHorizontal: theme.spacing.md, flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: Math.max(56, insets.bottom + theme.spacing.md + 16), flexGrow: 1 }}>
          {bothEmpty ? (
            <Text style={[styles.empty, { color: theme.colors.muted }]}>{t('home.emptyLong')}</Text>
          ) : (
            <>
              {todays.length > 0 ? (
                todays.map((item) => (
                  <HabitItem
                    key={item.id}
                    habit={item}
                    todayIso={today}
                    showDetails
                    onPress={() => (navigation as any).navigate('HabitDetails', { habitId: item.id })}
                    onCheckPress={() => {
                      setCompletion(item.id, today, item.goal?.value ?? 1)
                      showToast(t('habit.resetSuccess'), { type: 'success' })
                    }}
                  />
                ))
              ) : (
                <Text style={[styles.empty, { color: theme.colors.muted }]}>{t('home.noHabitsToday')}</Text>
              )}

              {todaysTasks.length > 0 ? (
                todaysTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onPress={() => (navigation as any).navigate('TaskDetails', { taskId: task.id })}
                    onCheckPress={() => {
                      toggleTask(task.id)
                      showToast(!task.completed ? t('task.marked') : t('task.unmarked'), { type: !task.completed ? 'success' : 'info' })
                    }}
                  />
                ))
              ) : (
                <Text style={[styles.empty, { color: theme.colors.muted }]}>{t('home.noTasksToday')}</Text>
              )}
            </>
          )}

          {completedCount > 0 ? (
            <Text onPress={() => setShowCompletedToday((v) => !v)} style={{ color: theme.colors.primary, alignSelf: 'flex-end', marginTop: 24 }}>
              {showCompletedToday ? t('home.hideCompleted', { count: completedCount }) : t('home.showCompleted', { count: completedCount })}
            </Text>
          ) : null}

          {showCompletedToday && completedCount > 0 ? (
            <View style={{ marginTop: 12 }}>
              <Text style={{ color: theme.colors.muted, marginBottom: 8 }}>{t('home.completedTitle')}</Text>

              {completedHabits.length === 0 && completedTasks.length === 0 ? (
                <Text style={[styles.empty, { color: theme.colors.muted }]}>{t('home.noCompletedToday')}</Text>
              ) : (
                <>
                  {completedHabits.map((h) => (
                    <View key={h.id} style={{ opacity: 0.6 }}>
                      <HabitItem
                        habit={h}
                        todayIso={today}
                        showDetails
                        onPress={() => (navigation as any).navigate('HabitDetails', { habitId: h.id })}
                        onCheckPress={() => {
                          useHabitStore.getState().setCompletion(h.id, today, 0)
                          showToast(t('task.unmarked'), { type: 'info' })
                        }}
                      />
                    </View>
                  ))}

                  {completedTasks.map((task) => (
                    <View key={task.id} style={{ opacity: 0.6 }}>
                      <TaskItem
                        task={task}
                        onPress={() => (navigation as any).navigate('TaskDetails', { taskId: task.id })}
                        onCheckPress={() => {
                          toggleTask(task.id)
                          showToast(!task.completed ? t('task.marked') : t('task.unmarked'), { type: !task.completed ? 'success' : 'info' })
                        }}
                      />
                    </View>
                  ))}
                </>
              )}
            </View>
          ) : null}
        </ScrollView>

        <Modal visible={showFabMenu} transparent animationType="fade" onRequestClose={() => setShowFabMenu(false)}>
          <TouchableWithoutFeedback onPress={() => setShowFabMenu(false)}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' }}>
              <TouchableWithoutFeedback>
                <View style={{ backgroundColor: theme.colors.surface, padding: 12, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                  <TouchableOpacity onPress={() => { setShowFabMenu(false); (navigation as any).navigate('CreateHabit') }} style={{ padding: 12 }}>
                    <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{t('home.addHabit')}</Text>
                    <Text style={{ color: theme.colors.muted, fontSize: 12 }}>{t('home.addHabitSubtitle')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => { setShowFabMenu(false); (navigation as any).navigate('CreateTask') }} style={{ padding: 12, marginTop: 6 }}>
                    <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{t('home.addTask')}</Text>
                    <Text style={{ color: theme.colors.muted, fontSize: 12 }}>{t('home.addTaskSubtitle')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setShowFabMenu(false)} style={{ padding: 12, marginTop: 8 }}>
                    <Text style={{ color: theme.colors.primary, fontWeight: '700', textAlign: 'center' }}>{t('home.cancel')}</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Fab onPress={() => setShowFabMenu(true)} />
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  header: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  habitItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600' },
  category: { fontSize: 13, marginTop: 4 },
  streakWrap: { alignItems: 'flex-end', marginHorizontal: 12 },
  streak: { fontWeight: '700' },
  empty: { textAlign: 'center', margin: 16, fontSize: 12 },
  quickButton: { padding: 8, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 8, marginBottom: 8 },
  taskRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  checkLeft: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1 },
  checkMark: { color: '#fff', fontWeight: '700' },
})