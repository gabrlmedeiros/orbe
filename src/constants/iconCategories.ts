export const ICON_CATEGORIES: Record<string, string[]> = {
  fitness: ['dumbbell','run','bike','yoga','weight-lifter','arm-flex'],
  health: ['water','heart-pulse','sleep','food-apple','pill','hospital-box'],
  mind: ['brain','meditation','book-open-variant','lightbulb','thought-bubble'],
  work: ['laptop','code-tags','briefcase','calendar-check','email','chart-line'],
  routine: ['bed','shower','coffee','walk','weather-sunny','moon-waning-crescent'],
  productivity: ['target','check-circle','timer','clipboard-check','rocket'],
  finance: ['cash','credit-card','bank','trending-up'],
  social: ['account-group','chat','phone','handshake'],
  general: ['star','flag','map-marker','trophy','fire'],
}

const KEYWORD_MAP: Record<string, string> = {
  // fitness
  'academia': 'dumbbell', 'gym': 'dumbbell', 'fitness': 'dumbbell', 'treino': 'dumbbell', 'run': 'run', 'corrida': 'run', 'correr': 'run', 'bike': 'bike', 'bicicleta': 'bike', 'yoga': 'yoga', 'pilates': 'yoga', 'peso': 'weight-lifter', 'flex': 'arm-flex',
  // health
  'água': 'water', 'agua': 'water', 'beber': 'water', 'hidratar': 'water', 'saúde': 'heart-pulse', 'saude': 'heart-pulse', 'coração': 'heart-pulse', 'sono': 'sleep', 'dormir': 'sleep', 'comer': 'food-apple', 'alimentação': 'food-apple', 'remédio': 'pill', 'remedio': 'pill',
  // mind
  'meditar': 'meditation', 'meditação': 'meditation', 'meditacao': 'meditation', 'ler': 'book-open-variant', 'leitura': 'book-open-variant', 'estudo': 'book-open-variant', 'concentrar': 'brain',
  // work
  'trabalho': 'briefcase', 'email': 'email', 'codigo': 'code-tags', 'coding': 'code-tags', 'projeto': 'laptop', 'reunião': 'calendar-check',
  // routine
  'rotina': 'bed', 'banho': 'shower', 'café': 'coffee', 'cafe': 'coffee', 'caminhar': 'walk', 'passear': 'walk', 'sol': 'weather-sunny', 'noite': 'moon-waning-crescent',
  // productivity / finance / social
  'meta': 'target', 'objetivo': 'target', 'finanças': 'cash', 'financas': 'cash', 'dinheiro': 'cash', 'pagar': 'credit-card', 'contas': 'bank', 'social': 'account-group', 'amigos': 'account-group', 'conversar': 'chat',
}

export function suggestIconsForText(text: string, max = 4): string[] {
  const t = (text || '').toLowerCase()
  const found: string[] = []
  if (!t.trim()) return []
  Object.entries(KEYWORD_MAP).forEach(([k, icon]) => {
    if (t.includes(k) && !found.includes(icon)) found.push(icon)
  })
  Object.entries(ICON_CATEGORIES).forEach(([cat, icons]) => {
    if (t.includes(cat) && !found.length) {
      icons.forEach((i) => { if (!found.includes(i)) found.push(i) })
    }
  })
  if (!found.length) {
    const flat = Object.values(ICON_CATEGORIES).flat()
    for (const i of flat) {
      if (!found.includes(i)) found.push(i)
      if (found.length >= max) break
    }
  }
  return found.slice(0, max)
}

export default ICON_CATEGORIES
