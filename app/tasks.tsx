import Fab from '@/components/Fab'
import Screen from '@/components/Screen'
import TopBar from '@/components/TopBar'
import TaskItem from '@/components/ui/task-item'
import { t } from '@/i18n'
import { useTheme } from '@/providers/ThemeProvider'
import { useTaskStore } from '@/store/useTaskStore'
import { sortTasks } from '@/utils/sortTasks'
import { showToast } from '@/utils/toastService'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Tasks() {
const navigation = useNavigation()
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()
  const tasks = useTaskStore((s) => s.tasks)
  const toggle = useTaskStore((s) => s.toggleComplete)
  const [showCompleted, setShowCompleted] = React.useState(false)

  const openTasks = sortTasks(tasks.filter((t) => !t.completed))
  const completedTasks = sortTasks(tasks.filter((t) => t.completed))

  return (
    <Screen>
      <TopBar title={t('tasks.title')} />
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: theme.spacing.md, paddingBottom: Math.max(56, insets.bottom + theme.spacing.md + 16), flexGrow: 1 }}>

          {openTasks.length === 0 ? (
            <Text style={[styles.empty, { color: theme.colors.muted }]}>{t('tasks.noOpen')}</Text>
          ) : (
            openTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onPress={() => (navigation as any).navigate('TaskDetails', { taskId: task.id })}
                onCheckPress={() => {
                  toggle(task.id)
                  showToast(!task.completed ? t('task.marked') : t('task.unmarked'), { type: !task.completed ? 'success' : 'info' })
                }}
              />
            ))
          )}

          {completedTasks.length > 0 && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 16 }}>
              <Text style={{ fontWeight: '700', fontSize: 18 }} />
              <Text onPress={() => setShowCompleted((v) => !v)} style={{ color: theme.colors.primary }}>{showCompleted ? t('home.hideCompleted', { count: completedTasks.length }) : t('home.showCompleted', { count: completedTasks.length })}</Text>
            </View>
          )}

          {showCompleted && (
            <View>
              <Text style={{ color: theme.colors.muted, marginBottom: 8 }}>{t('tasks.completedTitle')}</Text>
              {completedTasks.length === 0 ? (
                <Text style={[styles.empty, { color: theme.colors.muted }]}>{t('tasks.noCompleted')}</Text>
              ) : (
                completedTasks.map((t) => (
                  <View key={t.id} style={{ opacity: 0.6 }}>
                    <TaskItem
                      task={t}
                      onPress={() => (navigation as any).navigate('TaskDetails', { taskId: t.id })}
                      onCheckPress={() => {
                        toggle(t.id)
                        showToast(!t.completed ? t('task.marked') : t('task.unmarked'), { type: !t.completed ? 'success' : 'info' })
                      }}
                    />
                  </View>
                ))
              )}
            </View>
          )}
        </ScrollView>

        <Fab onPress={() => (navigation as any).navigate('CreateTask')} />
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  header: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  empty: { textAlign: 'center', marginTop: 20 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  checkLeft: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1 },
  checkMark: { color: '#fff', fontWeight: '700' },
})
