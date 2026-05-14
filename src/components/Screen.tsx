import { useTheme } from '@/providers/ThemeProvider'
import React from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = {
  children: React.ReactNode
}

export default function Screen({ children }: Props) {
  const { theme } = useTheme()
  const { width } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  const includeTop = !!(insets.top && insets.top > 0)
  const isTabletWidth = width >= 700
  const topPaddingRaw = theme.spacing.md + (includeTop ? insets.top : 0)
  const topPadding = Math.min(topPaddingRaw, 40)

  const maxWidth = width >= 1200 ? 1100 : width >= 1000 ? 1000 : isTabletWidth ? Math.min(1100, Math.floor(width * 0.92)) : '100%'

  return (
    <SafeAreaView
      edges={includeTop ? ["top", "bottom", "left", "right"] : ["bottom", "left", "right"]}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: topPadding,
          paddingBottom: Math.min(insets.bottom + (isTabletWidth ? 8 : 0), 80),
          paddingLeft: (isTabletWidth ? theme.spacing.lg : theme.spacing.md) + insets.left,
          paddingRight: (isTabletWidth ? theme.spacing.lg : theme.spacing.md) + insets.right,
          alignItems: 'center',
          justifyContent: 'flex-start',
        },
      ]}
    >
      <View style={[styles.inner, { maxWidth }]}>{children}</View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { width: '100%', flex: 1 },
})
