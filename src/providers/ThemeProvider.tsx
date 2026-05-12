import { AppTheme, dark, light } from '@/constants/theme'
import React, { createContext, useContext, useMemo, useState } from 'react'
import { Appearance } from 'react-native'

type ThemeName = 'light' | 'dark'

type ThemeContextValue = {
  theme: AppTheme
  themeName: ThemeName
  setThemeName: (t: ThemeName) => void
  toggleTheme: () => void
}

const defaultName: ThemeName = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light'

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>(defaultName)

  const theme = useMemo(() => (themeName === 'dark' ? dark : light), [themeName])

  const value = useMemo(
    () => ({ theme, themeName, setThemeName, toggleTheme: () => setThemeName((s) => (s === 'dark' ? 'light' : 'dark')) }),
    [theme, themeName]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
