import i18n, { t } from '@/i18n'
import { useTheme } from '@/providers/ThemeProvider'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'

export default function TopBar({ title }: { title?: string }) {
  const { themeName, toggleTheme, theme } = useTheme()
  const isDark = themeName === 'dark'
  const navigation: any = useNavigation()
  const route: any = useRoute()

  const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)
  const raw = new Date().toLocaleDateString(i18n.locale || undefined, { weekday: 'long', day: 'numeric', month: 'long' })
  const dateLine = capitalize(raw)

  const canGoBack = navigation?.canGoBack && navigation.canGoBack()

  const routeName = (route?.name as string) ?? ''
  const isCreateHabitEdit = routeName === 'CreateHabit' && !!(route?.params && (route.params as any).habitId)
  const isCreateTaskEdit = routeName === 'CreateTask' && !!(route?.params && (route.params as any).taskId)
  const showBack = canGoBack && (routeName === 'HabitDetails' || routeName === 'TaskDetails' || isCreateHabitEdit || isCreateTaskEdit)

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border }]}> 
      <View style={[styles.row, { alignItems: 'flex-start' }]}>
        <View style={styles.leftRow}>
          {showBack ? (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12, padding: 6 }}>
              <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
            </TouchableOpacity>
          ) : null}

          <View style={styles.dateCol}>
            <Text style={[styles.date, { color: theme.colors.text }]}>{dateLine}</Text>
            <Text style={[styles.motiv, { color: theme.colors.muted }]}>{t('top.motiv')}</Text>
          </View>
        </View>

        <View style={styles.right}>
          <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color={theme.colors.text} style={{ marginRight: 8 }} />
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.colors.muted, true: theme.colors.primary }}
            thumbColor={Platform.OS === 'android' ? '#fff' : undefined}
          />
        </View>
      </View>

      {title ? <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { width: '100%', paddingVertical: 10, paddingHorizontal: 16, justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateCol: { flexDirection: 'column' },
  date: { fontSize: 16, fontWeight: '700' },
  motiv: { fontSize: 13, marginTop: 2 },
  greeting: { fontSize: 16, fontWeight: '600' },
  title: { fontSize: 20, fontWeight: '700', marginTop: 24 },
  right: { flexDirection: 'row', alignItems: 'center' },
  leftRow: { flexDirection: 'row', alignItems: 'center' },
})
