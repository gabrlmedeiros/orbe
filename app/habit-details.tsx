import Screen from '@/components/Screen'
import TopBar from '@/components/TopBar'
import { t } from '@/i18n'
import { useTheme } from '@/providers/ThemeProvider'
import { useHabitStore } from '@/store/useHabitStore'
import { localIso } from '@/utils/date'
import { showToast } from '@/utils/toastService'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const num = parseInt(full, 16)
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

function hexToRgba(hex: string, a: number) {
  const { r, g, b } = hexToRgb(hex || '#000')
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

function getDaysBetween(start: Date, end: Date) {
  const out: Date[] = []
  const s = new Date(start)
  s.setHours(0, 0, 0, 0)
  const e = new Date(end)
  e.setHours(0, 0, 0, 0)
  for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
    out.push(new Date(d))
  }
  return out
}

export default function HabitDetails() {
  const route = useRoute()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { habitId } = (route.params as any) ?? {}
  const habit = useHabitStore((s) => s.habits.find((h) => h.id === habitId))
  const setCompletion = useHabitStore((s) => s.setCompletion)

  const insets = useSafeAreaInsets()

  const todayIso = localIso()
  const todayAmount = habit ? (habit.completed?.[todayIso] ?? 0) : 0
  const [amount, setAmount] = React.useState(String(todayAmount || ''))

    if (!habit) {
    return (
      <Screen>
        <TopBar title={t('screens.habit')} />
        <View style={{ padding: theme.spacing.md }}>
          <Text style={{ color: theme.colors.muted }}>{t('habit.notFound')}</Text>
        </View>
      </Screen>
    )
  }


  return (
    <Screen>
      <TopBar />
      <ScrollView contentContainerStyle={{ padding: theme.spacing.md, paddingBottom: Math.max(56, insets.bottom + theme.spacing.md + 16), flexGrow: 1 }}>
        <View style={styles.row}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={[styles.iconWrap, { backgroundColor: habit.color }]}>
              <MaterialCommunityIcons name={habit.icon as any} size={28} color="#fff" />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={[styles.title, { color: theme.colors.text }]}>{habit.title}</Text>
              {habit.category ? <Text style={{ color: theme.colors.muted }}>{habit.category}</Text> : null}
            </View>
          </View>
          <TouchableOpacity
            onPress={() => (navigation as any).navigate('CreateHabit', { habitId })}
            style={{ padding: 8, marginLeft: 12, alignSelf: 'center' }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialCommunityIcons name="pencil" size={20} color={theme.colors.muted} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(t('habit.resetTitle'), t('habit.resetConfirm'), [
                { text: t('remove.cancel'), style: 'cancel' },
                { text: t('remove.remove'), style: 'destructive', onPress: () => {
                  const todayIso = new Date().toISOString()
                  useHabitStore.getState().updateHabit(habit.id, { createdAt: todayIso, completed: {}, streak: 0, bestStreak: 0 } as any)
                  showToast(t('habit.resetSuccess'), { type: 'success' })
                } }
              ])
            }}
            style={{ padding: 8, marginLeft: 6, alignSelf: 'center' }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialCommunityIcons name="restart" size={20} color={theme.colors.muted} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Alert.alert(t('habit.removeTitle'), t('habit.removeConfirm'), [
                { text: t('remove.cancel'), style: 'cancel' },
                { text: t('remove.remove'), style: 'destructive', onPress: () => {
                  useHabitStore.getState().removeHabit(habit.id)
                  showToast(t('habit.removeSuccess'), { type: 'success' })
                  navigation.goBack()
                } }
              ])
            }}
            style={{ padding: 8, marginLeft: 6, alignSelf: 'center' }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={20} color={theme.colors.muted} />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{t('habit.sequence')}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <MaterialCommunityIcons name="fire" size={18} color={habit.color || theme.colors.accent} />
            <Text style={{ color: theme.colors.text, marginLeft: 8, fontWeight: '700' }}>{habit.streak} {t('habit.daysLabel')}</Text>
            <Text style={{ color: theme.colors.muted, marginLeft: 12 }}>{t('habit.best')}: {habit.bestStreak} {t('habit.daysLabel')}</Text>
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{t('habit.frequency')}</Text>
          <Text style={{ color: theme.colors.muted, marginTop: 8 }}>{(() => {
            if (habit.frequency === 'daily') return t('habit.freqDaily')
            if (habit.frequency === 'weekly') return t('habit.freqWeekly')
            if (habit.frequency === 'custom') {
              const dayNames = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
              if (habit.days && habit.days.length) return `${t('habit.freqCustom')} (${habit.days.map(d => dayNames[(d - 1) % 7]).join(', ')})`
              return t('habit.freqCustom')
            }
            return String(habit.frequency)
          })()}</Text>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{t('habit.history')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
            {getDaysBetween(new Date(habit.createdAt), new Date()).map((d) => {
              const iso = require('@/utils/date').localIso(d)
              const val = habit.completed?.[iso] ?? 0
              const goalVal = habit.goal?.value ?? 1
              const ratio = Math.max(0, Math.min(1, val / (goalVal || 1)))
              const bg = ratio > 0 ? hexToRgba(habit.color || theme.colors.primary, 0.3 + 0.7 * ratio) : 'transparent'
              const border = ratio > 0 ? 'transparent' : theme.colors.border
              return (
                <View
                  key={iso}
                  style={{
                    width: 18,
                    height: 18,
                    margin: 3,
                    borderRadius: 4,
                    backgroundColor: bg,
                    borderWidth: 1,
                    borderColor: border,
                  }}
                />
              )
            })}
          </View>
        </View>

        {habit.goal ? (
          <View style={{ marginTop: 16 }}>
            <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{t('habit.goal')}</Text>
              <Text style={{ color: theme.colors.muted, marginTop: 8 }}>{habit.goal.value} {habit.goal.unit}</Text>
          </View>
        ) : null}

        <View style={{ marginTop: 16 }}>
          <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{t('habit.today')}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <TextInput
              placeholder={t('habit.placeholder_howMany')}
              placeholderTextColor={theme.colors.muted}
              value={amount}
              onChangeText={setAmount}
              keyboardType="number-pad"
              style={[styles.amountInput, { borderColor: theme.colors.border, color: theme.colors.text }]}
            />
            <TouchableOpacity
              onPress={() => {
                const v = Number(amount || 0)
                setCompletion(habit.id, todayIso, v)
                setAmount(v ? String(v) : '')
                showToast(v ? t('habit.resetSuccess') : t('task.unmarked'), { type: v ? 'success' : 'info' })
              }}
              style={[styles.confirmButton, { backgroundColor: habit.color || theme.colors.primary }]}
            >
              <Text style={{ color: '#fff', fontWeight: '700' }}>{todayAmount ? t('habit.update') : t('habit.register')}</Text>
            </TouchableOpacity>
          </View>
          {habit.goal ? (
            <Text style={{ color: theme.colors.muted, marginTop: 8 }}>
              Progresso hoje: {Math.round(((habit.completed?.[todayIso] ?? 0) / (habit.goal?.value || 1)) * 100)}% ({habit.completed?.[todayIso] ?? 0}/{habit.goal?.value} {habit.goal?.unit})
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 72, height: 72, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700' },
  editButton: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10, alignItems: 'center' },
  amountInput: { borderWidth: 1, padding: 8, borderRadius: 8, width: 100, marginRight: 8 },
  confirmButton: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
})
