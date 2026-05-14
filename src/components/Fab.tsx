import { useTheme } from '@/providers/ThemeProvider'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = {
  onPress: () => void
}

export default function Fab({ onPress }: Props) {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()
  const { width } = useWindowDimensions()
  const isTablet = width >= 700
  let androidNavBar = 0
  try {
    const ExtraDimensions = require('react-native-extra-dimensions-android')
    if (ExtraDimensions && typeof ExtraDimensions.getSoftMenuBarHeight === 'function') {
      androidNavBar = ExtraDimensions.getSoftMenuBarHeight() || 0
    }
  } catch (e) {
    androidNavBar = 0
  }

  const fallbackBottom = isTablet ? 88 : 56
  const extraForDevice = isTablet ? 24 : 16
  const effectiveInset = Math.max(insets.bottom, androidNavBar)
  const tabBarHeight = isTablet ? 84 : 64
  const bottom = Math.max(fallbackBottom, effectiveInset + tabBarHeight + theme.spacing.sm + extraForDevice)

  return (
    <TouchableOpacity style={[styles.button, { right: theme.spacing.md, bottom, backgroundColor: theme.colors.primary }]} onPress={onPress} activeOpacity={0.8}>
      <MaterialCommunityIcons name="plus" size={28} color="#fff" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  plus: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '600',
  },
})
