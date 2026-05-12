export function localIso(date?: Date) {
  const d = date ?? new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function toLocalDateStart(isoDate: string) {
  return new Date(isoDate + 'T00:00:00')
}
