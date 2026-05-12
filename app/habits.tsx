import Fab from '@/components/Fab'
import Screen from '@/components/Screen'
import TopBar from '@/components/TopBar'
import HabitItem from '@/components/ui/habit-item'
import { t } from '@/i18n'
import { useTheme } from '@/providers/ThemeProvider'
import { useHabitStore } from '@/store/useHabitStore'
import { localIso } from '@/utils/date'
import { showToast } from '@/utils/toastService'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'

export default function Habits() {
  const habits = useHabitStore((s) => s.habits)
  const setCompletion = useHabitStore((s) => s.setCompletion)
  const navigation = useNavigation()
  const { theme } = useTheme()
  const todayIso = localIso()

  return (
    <Screen>
      <TopBar title={t('habits.title')} />
      <View style={{ flex: 1 }}>
        <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        style={{ paddingHorizontal: theme.spacing.md }}
        renderItem={({ item }) => (
          <HabitItem
            habit={item}
            todayIso={todayIso}
            showDetails
            onPress={() => (navigation as any).navigate('HabitDetails', { habitId: item.id })}
            onCheckPress={() => {
              const doneToday = !!(item.completed && item.completed[todayIso])
              if (!doneToday) {
                const amount = item.goal?.value ?? 1
                setCompletion(item.id, todayIso, amount)
                showToast(t('habit.resetSuccess'), { type: 'success' })
              } else {
                setCompletion(item.id, todayIso, 0)
                showToast(t('task.unmarked'), { type: 'info' })
              }
            }}
          />
        )}
        ListEmptyComponent={<Text style={[styles.empty, { color: theme.colors.muted }]}>{t('habits.noneYet')}</Text>}
        />

        <Fab onPress={() => (navigation as any).navigate('CreateHabit')} />
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  header: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  habitItem: { padding: 12, borderBottomWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600' },
  category: { fontSize: 13, marginTop: 4 },
  goal: { fontSize: 13, marginTop: 4 },
  streakWrap: { flexDirection: 'row', alignItems: 'center' },
  streakCol: { width: 120, alignItems: 'flex-end' },
  checkCol: { width: 48, marginLeft: 8, alignItems: 'center', justifyContent: 'center' },
  streak: { fontWeight: '700' },
  best: { fontSize: 12 },
  empty: { textAlign: 'center', marginTop: 20 },
  quickButton: { padding: 8, width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  quickButtonDone: { padding: 8, width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
})
