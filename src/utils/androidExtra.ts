import { Platform } from 'react-native'

export function getAndroidNavBarHeight(): number {
  if (Platform.OS !== 'android') return 0
  try {
    const ExtraDimensions = require('react-native-extra-dimensions-android')
    if (ExtraDimensions && typeof ExtraDimensions.getSoftMenuBarHeight === 'function') {
      const h = ExtraDimensions.getSoftMenuBarHeight()
      return typeof h === 'number' ? h : 0
    }
  } catch (e) {
    // gracefully fail
  }
  return 0
}
