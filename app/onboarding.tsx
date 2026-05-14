import { t } from '@/i18n'
import { useTheme } from '@/providers/ThemeProvider'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const PAGES = [
  { titleKey: 'onboarding.page1.title', descKey: 'onboarding.page1.desc', icon: 'orbit' },
  { titleKey: 'onboarding.page2.title', descKey: 'onboarding.page2.desc', icon: 'fire' },
  { titleKey: 'onboarding.page3.title', descKey: 'onboarding.page3.desc', icon: 'clipboard-check' },
]

type Props = { onFinish?: () => void }

export default function Onboarding({ onFinish }: Props) {
  const [index, setIndex] = useState(0)
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()
  const { height } = useWindowDimensions()
  const centerContent = height < 700

  async function finish() {
    try { await AsyncStorage.setItem('seenOnboarding', '1') } catch (e) { /* ignore */ }
    if (onFinish) onFinish()
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingBottom: 24 + insets.bottom }] }>
      <View style={[styles.content, centerContent ? { justifyContent: 'center' } : { paddingTop: 24 }] }>
        <View style={[styles.iconWrap, { backgroundColor: theme.colors.primary }]}> 
          <MaterialCommunityIcons name={PAGES[index].icon as any} size={48} color="#fff" />
        </View>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t(PAGES[index].titleKey)}</Text>
        <Text style={[styles.desc, { color: theme.colors.muted }]}>{t(PAGES[index].descKey)}</Text>
      </View>

      <View style={[styles.actions, { backgroundColor: 'transparent', bottom: 24 + insets.bottom }]}> 
        {index > 0 ? (
          <TouchableOpacity onPress={() => setIndex((s) => Math.max(0, s - 1))}>
            <Text style={{ color: theme.colors.muted }}>{t('onboarding.back')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={async () => { await AsyncStorage.setItem('seenOnboarding', '1'); if (onFinish) onFinish() }}>
            <Text style={{ color: theme.colors.muted }}>{t('onboarding.skip')}</Text>
          </TouchableOpacity>
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {PAGES.map((_, i) => (
            <View key={i} style={[styles.dot, i === index ? { backgroundColor: theme.colors.primary } : { backgroundColor: '#00000010' }]} />
          ))}
        </View>

        {index < PAGES.length - 1 ? (
          <TouchableOpacity onPress={() => setIndex((s) => s + 1)}>
            <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>{t('onboarding.next')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={finish} style={[styles.startButton, { backgroundColor: theme.colors.primary }]}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>{t('onboarding.start')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconWrap: { width: 110, height: 110, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
  desc: { fontSize: 16, textAlign: 'center', maxWidth: 360 },
  actions: { position: 'absolute', left: 24, right: 24, bottom: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 8, marginHorizontal: 6 },
  startButton: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8 },
})
