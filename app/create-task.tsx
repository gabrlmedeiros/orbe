import DurationCarousel from '@/components/ui/duration-carousel'
import i18n, { t } from '@/i18n'
import { useTheme } from '@/providers/ThemeProvider'
import { useTaskStore } from '@/store/useTaskStore'
import { toLocalDateStart } from '@/utils/date'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useState } from 'react'
import { BackHandler, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = { onClose?: () => void }

export default function CreateTask({ onClose }: Props) {
  const route = useRoute()
  const editingId = (route as any).params?.taskId as string | undefined
  const editTask = useTaskStore((s) => s.tasks.find((t) => t.id === editingId))
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [duration, setDuration] = useState<number | null>(null)
  const [frequency, setFrequency] = useState<'none' | 'daily' | 'weekly' | 'custom'>('none')
  const [days, setDays] = useState<number[] | undefined>(undefined)
  const [showDurationModal, setShowDurationModal] = useState(false)
  const [showCustomDuration, setShowCustomDuration] = useState(false)
  const [customDurationMinutes, setCustomDurationMinutes] = useState('')
  const [tempDurationMinutes, setTempDurationMinutes] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showDateModal, setShowDateModal] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [tempDate, setTempDate] = useState<Date | null>(null)

  const navigation = useNavigation()
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()
  const addTask = useTaskStore((s) => s.addTask)

  const weekdaysShort = React.useMemo(() => {
    try {
      const base = new Date(2023, 0, 1) 
      const fmt = new Intl.DateTimeFormat(i18n.locale || undefined, { weekday: 'short' })
      return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(base.getFullYear(), base.getMonth(), base.getDate() + i)))
    } catch (e) {
      return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }
  }, [i18n.locale])

  React.useEffect(() => {
    const onBack = () => {
      if (onClose) onClose()
      else navigation.goBack()
      return true
    }
    if (Platform.OS === 'android') {
      const sub = BackHandler.addEventListener('hardwareBackPress', onBack)
      return () => sub.remove()
    }
  }, [])

  function handleSave() {
    if (!title.trim()) return
    let dueAt: string | null = null
    let allDay = false
    if (selectedDate) {
      const hasTime = selectedDate.getHours() !== 0 || selectedDate.getMinutes() !== 0
      if (hasTime) {
        dueAt = selectedDate.toISOString()
        allDay = false
      } else {
        dueAt = require('@/utils/date').localIso(selectedDate)
        allDay = true
      }
    }

    const durVal = duration ?? null
    if (editingId && editTask) {
      useTaskStore.getState().updateTask(editingId, { title: title.trim(), notes: notes.trim() || undefined, priority, dueAt, allDay, duration: durVal, frequency, days })
    } else {
      addTask({ title: title.trim(), notes: notes.trim() || undefined, priority, dueAt, allDay, duration: durVal, frequency, days })
    }
    if (onClose) onClose()
    else navigation.goBack()
  }

  React.useEffect(() => {
    if (editTask) {
      setTitle(editTask.title)
      setNotes(editTask.notes ?? '')
      setPriority(editTask.priority)
      setDuration(editTask.duration ?? null)
      setFrequency((editTask as any).frequency ?? 'none')
      setDays((editTask as any).days)
      let sd: Date | null = null
      if (editTask.dueAt) {
        sd = editTask.allDay ? toLocalDateStart(editTask.dueAt) : new Date(editTask.dueAt)
      }
      setSelectedDate(sd)
      if (sd) {
        setTempDate(new Date(sd))
        const hasTime = !editTask.allDay && (sd.getHours() !== 0 || sd.getMinutes() !== 0)
        setShowTimePicker(hasTime)
      } else {
        setShowTimePicker(false)
      }
    }
  }, [editingId])


  function formatSelected() {
    if (!selectedDate) return 'Agendar'
    const date = new Intl.DateTimeFormat(i18n.locale || undefined, { dateStyle: 'short' }).format(selectedDate)
    const time = new Intl.DateTimeFormat(i18n.locale || undefined, { hour: '2-digit', minute: '2-digit' }).format(selectedDate)
    const hasTime = selectedDate.getHours() !== 0 || selectedDate.getMinutes() !== 0
    return hasTime ? `${date} ${time}` : date
  }

  const saveButtonMarginBottom = Math.max(48, insets.bottom + theme.spacing.md + 24)

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background, flexGrow: 1, paddingBottom: saveButtonMarginBottom }] }>
        <View style={styles.inner}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 12 }}>
            <TouchableOpacity onPress={() => { if (onClose) onClose(); else navigation.goBack() }} style={{ padding: 8 }}>
              <MaterialCommunityIcons name="close" size={24} color={theme.colors.muted} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('createTask.title')}</Text>
          <TextInput placeholder="Ex: Comprar mantimentos" placeholderTextColor={theme.colors.muted} value={title} onChangeText={setTitle} style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]} />
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('createTask.description')}</Text>
          <TextInput placeholder={t('createTask.placeholderDescription')} placeholderTextColor={theme.colors.muted} value={notes} onChangeText={setNotes} style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text, height: 100 }]} multiline />

          <Text style={[styles.label, { color: theme.colors.text }]}>{t('createTask.priority')}</Text>
          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            {(['low','medium','high'] as const).map((p) => (
              <TouchableOpacity key={p} onPress={() => setPriority(p)} style={[styles.freqButton, priority === p && { borderColor: theme.colors.primary }]}> 
                <Text style={{ color: theme.colors.text }}>{p === 'low' ? t('createTask.prioLow') : p === 'medium' ? t('createTask.prioMedium') : t('createTask.prioHigh') }</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { color: theme.colors.text }]}>{t('createTask.repeat')}</Text>
          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            {(['none','daily','weekly','custom'] as const).map((f) => (
              <TouchableOpacity key={f} onPress={() => setFrequency(f)} style={[styles.freqButton, frequency === f && { borderColor: theme.colors.primary }]}> 
                <Text style={{ color: theme.colors.text }}>{f === 'none' ? t('createTask.repeatNone') : f === 'daily' ? t('createTask.repeatDaily') : f === 'weekly' ? t('createTask.repeatWeekly') : t('createTask.repeatCustom') }</Text>
              </TouchableOpacity>
            ))}
          </View>

          {frequency === 'custom' && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
              {weekdaysShort.map((d, idx) => {
                const dayNum = idx + 1
                const on = days?.includes(dayNum)
                return (
                  <TouchableOpacity key={d} onPress={() => {
                    const next = on ? (days ?? []).filter(x => x !== dayNum) : [...(days ?? []), dayNum]
                    setDays(next.length ? next : undefined)
                  }} style={[styles.dayButton, on && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]}>
                    <Text style={{ color: on ? '#fff' : theme.colors.text }}>{d}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          )}

          <Text style={[styles.label, { color: theme.colors.text }]}>{t('createTask.duration')}</Text>
          <TouchableOpacity onPress={() => { setTempDurationMinutes(duration ? Math.round(duration * 60) : null); setShowDurationModal(true) }} style={[styles.input, { borderColor: theme.colors.border, justifyContent: 'center' }]}> 
            <Text style={{ color: duration !== null ? theme.colors.text : theme.colors.muted }}>{duration !== null ? (function() {
              const h = Math.floor(duration)
              const rem = Math.round((duration - h) * 60)
              if (h > 0 && rem > 0) return `${h}h ${rem}m`
              if (h > 0) return `${h}h`
              return `${rem}m`
            })() : t('createTask.selectDuration')}</Text>
          </TouchableOpacity>

          <Modal visible={showDurationModal} transparent animationType="fade" onRequestClose={() => setShowDurationModal(false)}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}> 
                <Text style={{ fontWeight: '700', padding: 12 }}>{t('createTask.selectDurationTitle')}</Text>
                {showCustomDuration ? (
                  <View style={{ padding: 12 }}>
                    <TextInput placeholder={t('createTask.customDurationPlaceholder')} placeholderTextColor={theme.colors.muted} value={customDurationMinutes} onChangeText={setCustomDurationMinutes} keyboardType="numeric" style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]} />
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                      <TouchableOpacity onPress={() => { setShowCustomDuration(false); setCustomDurationMinutes('') }} style={[styles.modalButton, { marginRight: 12 }]}>
                        <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>{t('createTask.cancel')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        const n = parseFloat(customDurationMinutes)
                        if (!isNaN(n) && n > 0) setTempDurationMinutes(Math.round(n))
                        setShowCustomDuration(false)
                        setCustomDurationMinutes('')
                      }} style={styles.modalButton}>
                        <Text style={[styles.modalButtonText, { color: theme.colors.primary }]}>{t('createTask.save')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <>
                    <DurationCarousel
                      onSelect={(mins: number) => { setTempDurationMinutes(mins) }}
                      selectedMinutes={tempDurationMinutes ?? (duration ? Math.round(duration * 60) : null)}
                    />

                    <TouchableOpacity onPress={() => setShowCustomDuration(true)} style={{ padding: 12, borderTopWidth: 1, borderColor: '#00000006' }}>
                      <Text style={{ color: theme.colors.primary }}>{t('createTask.otherDuration')}</Text>
                    </TouchableOpacity>

                    <View style={styles.modalButtons}>
                      <TouchableOpacity onPress={() => { setDuration(null); setShowDurationModal(false); setTempDurationMinutes(null) }} style={styles.modalButton}>
                        <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>{t('createTask.remove')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => { if (tempDurationMinutes != null) setDuration(tempDurationMinutes / 60); setShowDurationModal(false); setTempDurationMinutes(null) }} style={styles.modalButton}>
                        <Text style={[styles.modalButtonText, { color: theme.colors.primary }]}>{t('createTask.save')}</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>
          </Modal>

          <Text style={[styles.label, { color: theme.colors.text }]}>{t('createTask.selectDateTime')}</Text>
          <TouchableOpacity onPress={() => { setTempDate(selectedDate ?? new Date()); setShowTimePicker(selectedDate ? (selectedDate.getHours() !== 0 || selectedDate.getMinutes() !== 0) : false); setShowDateModal(true) }} style={[styles.input, { borderColor: theme.colors.border, justifyContent: 'space-between', paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }]}> 
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="calendar-clock" size={18} color={theme.colors.primary} style={{ marginRight: 8 }} />
              {selectedDate ? <Text style={{ color: theme.colors.muted, marginRight: 8 }}>{formatSelected()}</Text> : null}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.muted} />
            </View>
          </TouchableOpacity>

          <Modal visible={showDateModal} transparent animationType="fade" onRequestClose={() => setShowDateModal(false)}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}> 
                <DateTimePicker
                  value={tempDate ?? new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                  onChange={(_, date) => {
                    if (date) setTempDate(date)
                  }}
                />

                <View style={{ alignItems: 'center', margin: 12, marginBottom: 20 }}>          
                    <TouchableOpacity onPress={() => {
                    const next = !showTimePicker
                    setShowTimePicker(next)
                    if (!next && tempDate) {
                      const n = new Date(tempDate)
                      n.setHours(0,0,0,0)
                      setTempDate(n)
                    }
                  }}>
                    <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>{showTimePicker ? t('createTask.removeTime') : t('createTask.addTime')}</Text>
                  </TouchableOpacity>
                </View>

                {showTimePicker && (
                  <View style={{ paddingHorizontal: 12 }}>
                    <DateTimePicker
                      value={tempDate ?? new Date()}
                      mode="time"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={(_, time) => {
                        if (!time) return
                        const base = tempDate ? new Date(tempDate) : new Date()
                        base.setHours(time.getHours(), time.getMinutes(), 0, 0)
                        setTempDate(base)
                      }}
                    />
                  </View>
                )}

                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={() => { setShowDateModal(false); setTempDate(null) }} style={styles.modalButton}>
                    <Text style={[styles.modalButtonText, { color: theme.colors.text, fontWeight: '600' }]}>{t('createTask.cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (tempDate) {
                        const sd = new Date(tempDate)
                        if (!showTimePicker) sd.setHours(0,0,0,0)
                        setSelectedDate(sd)
                      }
                      setTempDate(null)
                      setShowDateModal(false)
                    }}
                    style={styles.modalButton}
                  >
                    <Text style={[styles.modalButtonText, { color: theme.colors.primary, fontWeight: '800' }]}>{t('createTask.select')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.colors.primary, marginBottom: saveButtonMarginBottom }]} onPress={handleSave}>
            <Text style={styles.saveText}>{t('createTask.saveTask')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  inner: { flex: 1 },
  input: { borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 16 },
  label: { marginBottom: 8, fontWeight: '600' },
  freqButton: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: 'transparent', borderRadius: 8, marginRight: 8 },
  dayButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 8, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: 'transparent' },
  saveButton: { marginTop: 24, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: 20 },
  modalContent: { borderRadius: 12, overflow: 'hidden' },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', padding: 12, borderTopWidth: 1, borderColor: '#00000010' },
  modalButton: { marginLeft: 12 },
  modalButtonText: { textTransform: 'uppercase', padding: 6, fontSize: 14 },
})
