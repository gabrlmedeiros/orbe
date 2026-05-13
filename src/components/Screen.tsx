import { useTheme } from '@/providers/ThemeProvider'
import React from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {
  children: React.ReactNode
}

export default function Screen({ children }: Props) {
  const { theme } = useTheme()
  const { width } = useWindowDimensions()

  const maxWidth = width > 1200 ? 1100 : width > 1000 ? 1000 : 900

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background, padding: theme.spacing.md, alignItems: 'center', justifyContent: 'flex-start' }]}>
      <View style={[styles.inner, { maxWidth }]}>{children}</View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { width: '100%', flex: 1 },
})
