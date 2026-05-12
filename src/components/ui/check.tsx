import { useTheme } from '@/providers/ThemeProvider'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

type Props = {
  checked?: boolean
  onPress?: (e?: any) => void
  size?: number
  style?: any
  hitSlop?: any
  color?: string
}

export default function Check({ checked = false, onPress, size = 24, style, hitSlop, color }: Props) {
  const { theme } = useTheme()
  const bg = checked ? (color ?? theme.colors.primary) : 'transparent'
  const border = checked ? 'transparent' : (color ?? theme.colors.border)

  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={hitSlop}
      style={[{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: border, backgroundColor: bg }, style]}
    >
      {checked ? <MaterialCommunityIcons name="check" size={Math.max(12, Math.round(size * 0.6))} color="#fff" /> : null}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  checkMark: { color: '#fff', fontWeight: '700' },
})
