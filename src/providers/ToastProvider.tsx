import { registerToast } from '@/utils/toastService'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { useTheme } from './ThemeProvider'

type ToastOptions = { type?: 'success' | 'info' | 'error' }

const ToastContext = createContext({ showToast: (msg: string, opts?: ToastOptions) => {} })

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null)
  const [type, setType] = useState<ToastOptions['type']>('info')
  const [visible, setVisible] = useState(false)
  const anim = React.useRef(new Animated.Value(0)).current
  const { theme } = useTheme()

  const showToast = useCallback((m: string, opts?: ToastOptions) => {
    setMsg(m)
    setType(opts?.type ?? 'info')
    setVisible(true)
  }, [])

  useEffect(() => {
    registerToast(showToast)
    return () => registerToast(null)
  }, [showToast])

  useEffect(() => {
    if (visible) {
      Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: true }).start()
      const t = setTimeout(() => {
        Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setVisible(false))
      }, 2000)
      return () => clearTimeout(t)
    }
  }, [visible, anim])

  const backgroundColor = type === 'success'
    ? theme.colors.success
    : type === 'error'
    ? theme.colors.danger
    : theme.colors.warning
  const textColor = type === 'success' || type === 'error' ? '#fff' : theme.colors.text

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && msg ? (
        <Animated.View pointerEvents="none" style={[styles.container, { opacity: anim }]}> 
          <View style={[styles.toast, { backgroundColor, borderColor: theme.colors.border }]}> 
            <Text style={[styles.text, { color: textColor }]}>{msg}</Text>
          </View>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 0, right: 0, bottom: 40, alignItems: 'center' },
  toast: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, maxWidth: '92%' },
  text: { fontSize: 14 },
})

export default ToastProvider
