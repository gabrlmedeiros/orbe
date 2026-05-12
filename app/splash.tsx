import { useTheme } from '@/providers/ThemeProvider'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function Splash() {
  const { theme } = useTheme()
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }] }>
      <View style={[styles.logo, { backgroundColor: theme.colors.primary }]}> 
        <MaterialCommunityIcons name="orbit" size={44} color="#fff" />
      </View>
      <Text style={[styles.title, { color: theme.colors.text }]}>Orbe</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 96, height: 96, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  title: { fontSize: 28, fontWeight: '800' },
})
