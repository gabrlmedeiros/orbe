import { useTheme } from '@/providers/ThemeProvider'
import React from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {
  children: React.ReactNode
}

export default function Screen({ children }: Props) {
  const { theme } = useTheme()

  return <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background, padding: theme.spacing.md }]}>{children}</SafeAreaView>
}

const styles = StyleSheet.create({
  container: { flex: 1 },
})
