import { t } from '@/i18n'
import { ThemeProvider, useTheme } from '@/providers/ThemeProvider'
import ToastProvider from '@/providers/ToastProvider'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CreateHabit from 'app/create-habit'
import CreateTask from 'app/create-task'
import HabitDetails from 'app/habit-details'
import Habits from 'app/habits'
import Home from 'app/home'
import Onboarding from 'app/onboarding'
import Splash from 'app/splash'
import Tasks from 'app/tasks'
import React, { useEffect, useState } from 'react'
import 'react-native-gesture-handler'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { enableScreens } from 'react-native-screens'

enableScreens()

const FORCE_ONBOARDING_FOR_TESTS = false

export type RootStackParamList = {
  Root: undefined
  HabitDetails: { habitId: string }
  CreateHabit: { habitId?: string } | undefined
  CreateTask: { taskId?: string } | undefined
  TaskDetails: { taskId: string }
}

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator()

function Tabs() {
  const { theme } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let name: any = 'home-outline'
          if (route.name === 'Home') name = 'home-outline'
          else if (route.name === 'Habits') name = 'flame-outline'
          else if (route.name === 'Tasks') name = 'clipboard-outline'
          return <Ionicons name={name} size={size} color={color} />
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          elevation: 0,
          shadowOpacity: 0,
          paddingTop: 6,
          paddingBottom: 6,
        },
        tabBarLabelStyle: { fontSize: 12, marginBottom: 2 },
        tabBarIconStyle: { marginTop: 2 },
        tabBarInactiveTintColor: theme.colors.muted,
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ title: t('tabs.home') }} />
      <Tab.Screen name="Habits" component={Habits} options={{ title: t('tabs.habits') }} />
      <Tab.Screen name="Tasks" component={Tasks} options={{ title: t('tabs.tasks') }} />
    </Tab.Navigator>
  )
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 800)
    if (FORCE_ONBOARDING_FOR_TESTS) {
      setShowOnboarding(true)
    } else {
      ;(async () => {
        try {
          const seen = await AsyncStorage.getItem('seenOnboarding')
          setShowOnboarding(!seen)
        } catch (e) {
          setShowOnboarding(true)
        }
      })()
    }
    return () => clearTimeout(t)
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ToastProvider>
          <SafeAreaProvider>
            {showSplash ? (
              <Splash />
            ) : showOnboarding ? (
              <Onboarding onFinish={() => setShowOnboarding(false)} />
            ) : (
              <NavigationContainer>
                <Stack.Navigator>
                  <Stack.Screen name="Root" component={Tabs} options={{ headerShown: false }} />
                  <Stack.Screen name="HabitDetails" component={HabitDetails} options={{ headerShown: false, title: t('screens.habit') }} />
                  <Stack.Screen name="CreateHabit" component={CreateHabit} options={{ headerShown: false, presentation: 'modal', title: t('screens.createHabit') }} />
                  <Stack.Screen name="CreateTask" component={CreateTask} options={{ headerShown: false, presentation: 'modal', title: t('screens.createTask') }} />
                  <Stack.Screen name="TaskDetails" component={require('./app/task-details').default} options={{ headerShown: false, title: t('screens.task') }} />
                </Stack.Navigator>
              </NavigationContainer>
            )}
          </SafeAreaProvider>
        </ToastProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}
