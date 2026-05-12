import { useTheme } from '@/providers/ThemeProvider'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

type Props = {
  onPress: () => void
}

export default function Fab({ onPress }: Props) {
  const { theme } = useTheme()

  return (
    <TouchableOpacity style={[styles.button, { right: theme.spacing.md, bottom: theme.spacing.sm, backgroundColor: theme.colors.primary }]} onPress={onPress} activeOpacity={0.8}>
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
