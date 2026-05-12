import { useTheme } from '@/providers/ThemeProvider'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Check from './check'

type Props = {
  habit: any
  onPress?: () => void
  onCheckPress?: () => void
  todayIso?: string
  showDetails?: boolean
}

export default function HabitItem({ habit, onPress, onCheckPress, todayIso, showDetails }: Props) {
  const { theme } = useTheme()
  const { localIso } = require('@/utils/date')
  const today = todayIso ?? localIso()
  const doneToday = !!(habit.completed && habit.completed[today])

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.habitItem, { borderBottomColor: theme.colors.border }]}> 
        <View style={styles.row}>
            <View style={{ marginRight: 12, justifyContent: 'center' }}>
            <Check
              checked={doneToday}
              onPress={onCheckPress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.quickButton}
              color={habit.color || theme.colors.primary}
            />
          </View>

          <View style={styles.info}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: theme.colors.text }]}>{habit.title}</Text>
              {habit.category ? (
                <Text style={[styles.category, { color: habit.color ?? theme.colors.muted }]}> 
                  <Text style={{ color: theme.colors.muted, marginRight: 6 }}>  •  </Text>
                  {habit.category}
                </Text>
              ) : null}
            </View>
            {showDetails && habit.goal ? <Text style={[styles.goal, { color: theme.colors.muted }]}>{habit.goal.value} {habit.goal.unit}</Text> : null}
          </View>

          <View style={styles.streakWrap}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="fire" size={24} color={habit?.color ?? theme.colors.accent} />
              <Text style={[styles.streak, { color: theme.colors.text, marginLeft: 6 }]}>{habit.streak}d</Text>
            </View>
            {showDetails && <Text style={[styles.best, { color: theme.colors.muted, marginTop: 6 }]}>Melhor sequência {habit.bestStreak}d</Text>}
          </View>

          <View style={[styles.iconWrap, { backgroundColor: habit.color ?? theme.colors.primary }]}> 
            <MaterialCommunityIcons name={habit.icon as any} size={18} color="#fff" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  habitItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  row: { flexDirection: 'row', alignItems: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600' },
  category: { fontSize: 13, fontWeight: '900' },
  streakWrap: { alignItems: 'flex-end', marginHorizontal: 12 },
  streak: { fontWeight: '700' },
  quickButton: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  goal: { fontSize: 13, marginTop: 4 },
  best: { fontSize: 12, marginTop: 6 },
})
