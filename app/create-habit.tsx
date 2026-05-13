import ICON_CATEGORIES, { suggestIconsForText } from '@/constants/iconCategories'
import { t } from '@/i18n'
import { useTheme } from '@/providers/ThemeProvider'
import { useHabitStore } from '@/store/useHabitStore'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import { BackHandler, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

const ALL_ICONS = Object.values(ICON_CATEGORIES).flat()

type Props = {
  onClose?: () => void
}

export default function CreateHabit({ onClose }: Props) {
  const [title, setTitle] = useState('')
  const [icon, setIcon] = useState(ALL_ICONS[0])

  const addHabit = useHabitStore((state) => state.addHabit)
  const updateHabit = useHabitStore((state) => state.updateHabit)
  const findHabit = useHabitStore((s) => s.habits)
  const route = useRoute()
  const habitId = (route.params as any)?.habitId
  const navigation = useNavigation()
  const { theme } = useTheme()
  const [color, setColor] = useState(theme.colors.primary)
  const [category, setCategory] = useState('')
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'custom'>('daily')
  const [days, setDays] = useState<number[] | undefined>(undefined)
  const [goalValue, setGoalValue] = useState<string>('')
  const [goalUnit, setGoalUnit] = useState<string>('')
  const [userPickedIcon, setUserPickedIcon] = useState(false)
  const [userPickedColor, setUserPickedColor] = useState(false)
  const [suggestedIcons, setSuggestedIcons] = useState<string[]>([])

  function suggestForTitle(text: string) {
    const suggestions = suggestIconsForText(text)
    setSuggestedIcons(suggestions)
    if (!userPickedIcon && suggestions.length) setIcon(suggestions[0])
  }

  function handleCreate() {
    if (!title) return

    const payload = {
      title,
      icon,
      color,
      category: category || undefined,
      frequency,
      days,
      goal: goalValue ? { value: Number(goalValue), unit: goalUnit || '' } : undefined,
    }

    if (habitId) {
      updateHabit(habitId, payload)
    } else {
      addHabit(payload)
    }
    if (onClose) onClose()
    else navigation.goBack()
  }

  useEffect(() => {
    if (!habitId) return
    const found = findHabit.find((h) => h.id === habitId)
    if (!found) return
    setTitle(found.title ?? '')
    setIcon(found.icon ?? ALL_ICONS[0])
    setColor(found.color ?? theme.colors.primary)
    setCategory(found.category ?? '')
    setFrequency(found.frequency ?? 'daily')
    setDays(found.days)
    if (found.goal) {
      setGoalValue(String(found.goal.value))
      setGoalUnit(found.goal.unit ?? '')
    }
    setUserPickedIcon(true)
    setUserPickedColor(true)
  }, [habitId])

  useEffect(() => {
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

  const scrollRef = useRef<ScrollView | null>(null)

  React.useEffect(() => {
    const t = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false })
    }, 50)
    return () => clearTimeout(t)
  }, [habitId])

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView ref={scrollRef} keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background, flexGrow: 1 }] } onContentSizeChange={() => scrollRef.current?.scrollTo({ y: 0, animated: false })}>
        <View style={styles.inner}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 12 }}>
            <TouchableOpacity onPress={() => { if (onClose) onClose(); else navigation.goBack() }} style={{ padding: 8 }}>
              <MaterialCommunityIcons name="close" size={24} color={theme.colors.muted} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.label, { color: theme.colors.text }]}>{t('createHabit.title')}</Text>
          <TextInput
            placeholder={t('createHabit.placeholderTitle')}
            placeholderTextColor={theme.colors.muted}
            value={title}
            onChangeText={(v) => { setTitle(v); suggestForTitle(v) }}
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
          />

          <Text style={[styles.label, { color: theme.colors.text }]}>{t('createHabit.category')}</Text>
          <TextInput
            placeholder={t('createHabit.placeholderCategory')}
            placeholderTextColor={theme.colors.muted}
            value={category}
            onChangeText={(v) => { setCategory(v); setSuggestedIcons(suggestIconsForText(v)) }}
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
          />

          <Text style={[styles.label, { color: theme.colors.text }]}>{t('createHabit.chooseIcon')}</Text>

          {suggestedIcons.length > 0 && !userPickedIcon ? (
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: theme.colors.muted, marginBottom: 6 }}>{t('createHabit.suggestions') || 'Sugestões'}</Text>
              <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                {suggestedIcons.map((name) => (
                  <TouchableOpacity key={name} onPress={() => { setIcon(name); setUserPickedIcon(true) }} style={[styles.iconButton, { marginRight: 12 }] }>
                    <MaterialCommunityIcons name={name as any} size={20} color={theme.colors.text} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : null}

          <View style={styles.iconGrid}>
            {ALL_ICONS.map((name) => {
              const selected = icon === name
              return (
                <TouchableOpacity
                  key={name}
                  style={[styles.iconButton, selected && { backgroundColor: color, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, elevation: 2 }]}
                  onPress={() => { setIcon(name); setUserPickedIcon(true) }}
                >
                  <MaterialCommunityIcons name={name as any} size={24} color={selected ? '#fff' : theme.colors.text} />
                </TouchableOpacity>
              )
            })}
          </View>

          <Text style={[styles.label, { color: theme.colors.text }]}>{t('createHabit.chooseColor')}</Text>
          <View style={styles.colorGrid}>
            {(theme.colors.palette ?? []).map((c) => {
              const selected = c === color
              return (
                <TouchableOpacity
                  key={c}
                  onPress={() => { setColor(c); setUserPickedColor(true) }}
                  style={[styles.colorSwatch, { backgroundColor: c }, selected && styles.colorSelected]}
                />
              )
            })}
          </View>

          <Text style={[styles.label, { color: theme.colors.text }]}>{t('createHabit.frequency')}</Text>
          <View style={styles.freqRow}>
            {(['daily','weekly','custom'] as const).map((f) => (
              <TouchableOpacity key={f} onPress={() => setFrequency(f)} style={[styles.freqButton, frequency === f && { borderColor: theme.colors.primary }]}> 
                <Text style={{ color: theme.colors.text }}>{f === 'daily' ? t('createHabit.freqDaily') : f === 'weekly' ? t('createHabit.freqWeekly') : t('createHabit.freqCustom')}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {frequency === 'custom' && (
            <View style={styles.daysRow}>
              {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map((d, idx) => {
                const dayNum = idx + 1
                const on = days?.includes(dayNum)
                return (
                  <TouchableOpacity key={d} onPress={() => {
                    const next = on ? (days ?? []).filter(x => x !== dayNum) : [...(days ?? []), dayNum]
                    setDays(next.length ? next : undefined)
                  }} style={[styles.dayButton, on && { backgroundColor: theme.colors.primary }]}
                  >
                    <Text style={{ color: on ? '#fff' : theme.colors.text }}>{d}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          )}

          <Text style={[styles.label, { color: theme.colors.text }]}>{t('createHabit.goal')}</Text>
          <View style={{ flexDirection: 'row' }}>
            <TextInput placeholder={t('createHabit.placeholderValue')} keyboardType="number-pad" placeholderTextColor={theme.colors.muted} value={goalValue} onChangeText={setGoalValue} style={[styles.input, { flex: 1, borderColor: theme.colors.border, color: theme.colors.text }]} />
            <TextInput placeholder={t('createHabit.placeholderUnit')} placeholderTextColor={theme.colors.muted} value={goalUnit} onChangeText={setGoalUnit} style={[styles.input, { width: 100, borderColor: theme.colors.border, color: theme.colors.text, marginLeft: 8 }]} />
          </View>

          <View style={styles.previewRow}>
            <View style={[styles.bigPreview, { backgroundColor: color }]}>
              <MaterialCommunityIcons name={icon as any} size={32} color="#fff" />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={[styles.previewLabel, { color: theme.colors.text, fontWeight: '700' }]}>{title || t('createHabit.newHabit')}</Text>
              {category ? <Text style={{ color: theme.colors.muted }}>{category}</Text> : null}
            </View>
          </View>

          <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.colors.primary }]} onPress={handleCreate}>
            <Text style={styles.saveText}>{t('createHabit.save')}</Text>
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
  hint: { fontSize: 13, marginTop: 6, marginBottom: 6 },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  iconButton: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12, marginBottom: 8, borderWidth: 1, borderColor: 'transparent' },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, marginBottom: 12 },
  colorSwatch: { width: 42, height: 42, borderRadius: '100%', marginRight: 8, marginBottom: 8, borderWidth: 3, borderColor: '#fff' },
  colorSelected: { borderColor: 'transparent', },
  previewRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  bigPreview: { width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, elevation: 3 },
  previewLabel: { marginRight: 12 },
  previewIcon: { width: 56, height: 56, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  saveButton: { marginTop: 24, paddingVertical: 12, marginBottom: 48, borderRadius: 8, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '700' },
  freqRow: { flexDirection: 'row', marginVertical: 8 },
  freqButton: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: 'transparent', borderRadius: 8, marginRight: 8 },
  daysRow: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 8 },
  dayButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 8, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: 'transparent' },
})
