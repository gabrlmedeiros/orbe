const truthy = (v?: any) => {
  if (v === undefined || v === null) return false
  const s = String(v).toLowerCase().trim()
  return s === '1' || s === 'true' || s === 'yes'
}

let expoExtra: any = undefined
try {
  const Constants = require('expo-constants')
  expoExtra = (Constants && (Constants.expoConfig || Constants.manifest) && (Constants.expoConfig || Constants.manifest).extra) || undefined
} catch (e) {
  expoExtra = undefined
}

let appJsonExtra: any = undefined
try {
  const appJson = require('../../app.json')
  appJsonExtra = appJson?.expo?.extra
} catch (e) {
  appJsonExtra = undefined
}

const raw = (typeof process !== 'undefined' && (process as any).env) || {}

export let DEMO_MODE: boolean =
  truthy(expoExtra?.REACT_APP_DEMO_MODE ?? expoExtra?.DEMO_MODE ?? expoExtra?.EXPO_DEMO_MODE) ||
  truthy(appJsonExtra?.REACT_APP_DEMO_MODE ?? appJsonExtra?.DEMO_MODE ?? appJsonExtra?.EXPO_DEMO_MODE) ||
  truthy(raw.REACT_APP_DEMO_MODE ?? raw.DEMO_MODE ?? raw.EXPO_DEMO_MODE)

export default {
  get DEMO_MODE() {
    return DEMO_MODE
  },
}
