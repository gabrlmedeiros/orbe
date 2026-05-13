import Screen from '@/components/Screen'
import TopBar from '@/components/TopBar'
import i18n, { t } from '@/i18n'
import { useTheme } from '@/providers/ThemeProvider'
import { useTaskStore } from '@/store/useTaskStore'
import { showToast } from '@/utils/toastService'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

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

export default function TaskDetails() {
  const route = useRoute()
  const navigation = useNavigation()
  const { theme } = useTheme()
  const taskId = (route as any).params?.taskId as string | undefined
  const task = useTaskStore((s) => s.tasks.find((t) => t.id === taskId))
  const toggle = useTaskStore((s) => s.toggleComplete)
  const update = useTaskStore((s) => s.updateTask)

    if (!task) return (
    <Screen>
      <TopBar />
      <View style={{ padding: theme.spacing.md }}>
        <Text style={{ color: theme.colors.muted }}>{t('task.notFound')}</Text>
      </View>
    </Screen>
  )

  return (
    <Screen>
      <TopBar />
      <ScrollView contentContainerStyle={{ padding: theme.spacing.md, paddingBottom: 120, flexGrow: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: '700' }}>{task.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => (navigation as any).navigate('CreateTask', { taskId: task.id } as any)} style={{ padding: 8 }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialCommunityIcons name="pencil" size={20} color={theme.colors.muted} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              Alert.alert(t('remove.title'), t('remove.confirm'), [
                { text: t('remove.cancel'), style: 'cancel' },
                { text: t('remove.remove'), style: 'destructive', onPress: () => { useTaskStore.getState().removeTask(task.id); navigation.goBack(); showToast(t('alerts.taskRemoved'), { type: 'success' }) } }
              ])
            }} style={{ padding: 8, marginLeft: 12 }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <MaterialCommunityIcons name="trash-can-outline" size={20} color={theme.colors.muted} />
            </TouchableOpacity>
          </View>
        </View>

        {task.notes ? <Text style={{ color: theme.colors.muted, marginTop: 12 }}>{task.notes}</Text> : null}

        {task.dueAt ? (
          (() => {
            if (task.allDay) {
              const dateIso = (task.dueAt as string).split('T')[0]
              const d = new Date(dateIso + 'T00:00:00')
              const date = new Intl.DateTimeFormat(i18n.locale || undefined, { dateStyle: 'short' }).format(d)
              return <Text style={{ color: theme.colors.muted, marginTop: 12 }}>{date}</Text>
            }
            const d = new Date((task as any).dueAt)
            const date = new Intl.DateTimeFormat(i18n.locale || undefined, { dateStyle: 'short' }).format(d)
            const hasTime = d.getHours() !== 0 || d.getMinutes() !== 0
            return <Text style={{ color: theme.colors.muted, marginTop: 12 }}>{hasTime ? `${date} ${new Intl.DateTimeFormat(i18n.locale || undefined, { hour: '2-digit', minute: '2-digit' }).format(d)}` : date}</Text>
          })()
        ) : null}

        {task.duration ? (() => {
          const mins = Math.round((task.duration || 0) * 60)
          if (mins <= 0) return null
          let formatted = ''
          if (mins >= 1440) formatted = `${Math.round(mins/1440)}d`
          else if (mins >= 60) {
            const h = Math.floor(mins/60)
            const m = mins % 60
            formatted = `${h}h${m ? ` ${m}m` : ''}`
          } else formatted = `${mins}m`
          return <Text style={{ color: theme.colors.muted, marginTop: 12 }}>{t('duration.label', { value: formatted })}</Text>
        })() : null}

        <View style={{ marginTop: 16 }}>
          <Text style={{ color: theme.colors.muted }}>{t('task.repeat')}</Text>
          <Text style={{ color: theme.colors.text, marginTop: 6 }}>{
            task.frequency === 'daily' ? t('task.repeatDaily') : task.frequency === 'weekly' ? t('task.repeatWeekly') : task.frequency === 'custom' ? t('task.repeatCustom') : t('task.repeatNone')
          }</Text>
        </View>

        {task.frequency && task.frequency !== 'none' ? (
          <View style={{ marginTop: 20 }}>
            <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{t('task.history')}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
              {getDaysBetween(new Date(task.createdAt), new Date()).map((d) => {
                const iso = require('@/utils/date').localIso(d)
                const done = !!(task.completedHistory && task.completedHistory[iso])
                const bg = done ? hexToRgba(theme.colors.primary, 0.9) : 'transparent'
                const border = done ? 'transparent' : theme.colors.border
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
        ) : null}

        <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity
              onPress={() => {
                const v = !task.completed
                toggle(task.id)
                showToast(v ? t('task.marked') : t('task.unmarked'), { type: v ? 'success' : 'info' })
              }}
              style={[styles.confirmButton, { backgroundColor: theme.colors.primary, alignSelf: 'flex-start' }]}
            >
              <Text style={{ color: '#fff', fontWeight: '700' }}>{task.completed ? t('task.update') : t('task.markComplete')}</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  button: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  confirmButton: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
})
