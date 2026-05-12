import i18n from '@/i18n'
import { useTheme } from '@/providers/ThemeProvider'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Check from './check'

type Props = {
  task: any
  onPress?: () => void
  onCheckPress?: () => void
}

export default function TaskItem({ task, onPress, onCheckPress }: Props) {
  const { theme } = useTheme()

  let isAlert = false
  let dateLabel = ''
  let hasTime = false
  if (task.dueAt) {
      if (task.allDay) {
      const dateIso = (task.dueAt as string).split('T')[0]
      const d = new Date(dateIso + 'T00:00:00')
      const nextDayStart = new Date(d)
      nextDayStart.setDate(nextDayStart.getDate() + 1)
      isAlert = !task.completed && Date.now() >= nextDayStart.getTime()
      dateLabel = new Intl.DateTimeFormat(i18n.locale || undefined, { dateStyle: 'short' }).format(d)
      hasTime = false
    } else {
      const d = new Date(task.dueAt)
      isAlert = !task.completed && d.getTime() <= Date.now()
      dateLabel = new Intl.DateTimeFormat(i18n.locale || undefined, { dateStyle: 'short' }).format(d)
      hasTime = d.getHours() !== 0 || d.getMinutes() !== 0
      if (hasTime) dateLabel = `${dateLabel} ${new Intl.DateTimeFormat(i18n.locale || undefined, { hour: '2-digit', minute: '2-digit' }).format(d)}`
    }
  }

  const priorityMark = task.priority === 'high' ? '!!!' : task.priority === 'medium' ? '!!' : task.priority === 'low' ? '!' : ''
  const priorityColor = task.priority === 'high' ? theme.colors.danger : task.priority === 'medium' ? theme.colors.warning : theme.colors.muted

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View style={[styles.row, { borderBottomColor: theme.colors.border }]}> 
        <Check checked={!!task.completed} onPress={onCheckPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={styles.checkLeft} />

        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          {priorityMark ? (
            <Text style={{ color: isAlert ? theme.colors.danger : priorityColor, fontWeight: '700', marginRight: 8, fontSize: 36 }}>{priorityMark}</Text>
          ) : null}

          <View style={{ flex: 1 }}>
            <Text style={{ color: isAlert ? theme.colors.danger : theme.colors.text, fontWeight: '600' }}>{task.title}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {task.dueAt ? <Text style={{ color: isAlert ? theme.colors.danger : theme.colors.muted, fontSize: 12 }}>{dateLabel}</Text> : null}
              {task.duration ? (() => {
                const mins = Math.round((task.duration || 0) * 60)
                if (mins <= 0) return null
                let label = ''
                if (mins >= 1440) label = `${Math.round(mins/1440)}d`
                else if (mins >= 60) {
                  const h = Math.floor(mins/60)
                  const m = mins % 60
                  label = `${h}h${m ? ` ${m}m` : ''}`
                } else label = `${mins}m`
                return <Text style={{ color: isAlert ? theme.colors.danger : theme.colors.muted, fontSize: 12, marginLeft: 8 }}>{label}</Text>
              })() : null}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  checkLeft: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1 },
})
