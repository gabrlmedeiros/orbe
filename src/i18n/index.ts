let i18n: any = require('i18n-js')

let detectedLocale: string | undefined = undefined
try {
  const RNLocalize = require('react-native-localize')
  const locales = RNLocalize && RNLocalize.getLocales ? RNLocalize.getLocales() : null
  if (locales && locales.length) detectedLocale = locales[0].languageTag
} catch (e) {
  try {
    const ExpoLoc = require('expo-localization')
    detectedLocale = ExpoLoc && ExpoLoc.locale
  } catch (e2) {
    try {
      detectedLocale = (Intl as any).DateTimeFormat().resolvedOptions().locale
    } catch (e3) {
      detectedLocale = undefined
    }
  }
}

const en = {
  task: {
    notFound: 'Task not found.',
    markComplete: 'Mark as complete',
    update: 'Update',
    marked: 'Task marked as completed',
    unmarked: 'Task unmarked'
  },
  remove: {
    title: 'Remove',
    confirm: 'Remove this task?',
    cancel: 'Cancel',
    remove: 'Remove'
  },
  alerts: {
    taskRemoved: 'Task removed'
  },
  duration: {
    label: 'Duration: {{value}}',
    dragToSelect: 'Drag to select'
  }
}

const pt = {
  task: {
    notFound: 'Tarefa não encontrada.',
    markComplete: 'Marcar como concluída',
    update: 'Atualizar',
    marked: 'Tarefa marcada como concluída',
    unmarked: 'Tarefa desmarcada'
  },
  remove: {
    title: 'Remover',
    confirm: 'Deseja remover esta tarefa?',
    cancel: 'Cancelar',
    remove: 'Remover'
  },
  alerts: {
    taskRemoved: 'Tarefa removida'
  },
  duration: {
    label: 'Duração: {{value}}',
    dragToSelect: 'Arraste para selecionar'
  }
}

i18n.translations = { en, 'pt-BR': pt }

i18n.translations.en.tabs = { home: 'Today', habits: 'Habits', tasks: 'Tasks' }
i18n.translations['pt-BR'].tabs = { home: 'Hoje', habits: 'Hábitos', tasks: 'Tarefas' }

i18n.translations.en.screens = { habit: 'Habit', createHabit: 'New Habit', createTask: 'New Task', task: 'Task' }
i18n.translations['pt-BR'].screens = { habit: 'Hábito', createHabit: 'Novo Hábito', createTask: 'Nova Tarefa', task: 'Tarefa' }

i18n.translations.en.home = {
  emptyLong: "It's calm today, no pending habits or tasks. Take a break or plan something.",
  noHabitsToday: 'No pending habits today.',
  noTasksToday: 'No tasks for today.',
  showCompleted: 'Show completed ({{count}})',
  hideCompleted: 'Hide completed ({{count}})',
  completedTitle: 'Completed',
  noCompletedToday: 'No completed today.',
  addHabit: 'Add habit',
  addHabitSubtitle: 'Create a recurring habit',
  addTask: 'Add task',
  addTaskSubtitle: 'Create a task with date and time',
  cancel: 'Cancel'
}

i18n.translations['pt-BR'].home = {
  emptyLong: 'Hoje está tranquilo por aqui, nenhum hábito pendente e nenhuma tarefa para hoje. Aproveite para descansar ou programar algo novo.',
  noHabitsToday: 'Nenhum hábito pendente hoje.',
  noTasksToday: 'Nenhuma tarefa para hoje.',
  showCompleted: 'Mostrar concluídos ({{count}})',
  hideCompleted: 'Ocultar concluídos ({{count}})',
  completedTitle: 'Concluídas',
  noCompletedToday: 'Nenhuma concluída hoje.',
  addHabit: 'Adicionar hábito',
  addHabitSubtitle: 'Criar um novo hábito recorrente',
  addTask: 'Adicionar tarefa',
  addTaskSubtitle: 'Criar uma tarefa com data e hora',
  cancel: 'Cancelar'
}

i18n.translations.en.habits = { title: 'Your habits', noneYet: 'No habits yet.' }
i18n.translations['pt-BR'].habits = { title: 'Seus hábitos', noneYet: 'Nenhum hábito ainda.' }

i18n.translations.en.tasks = { title: 'Your tasks', noOpen: 'No open tasks.', completedTitle: 'Completed', noCompleted: 'No completed tasks.' }
i18n.translations['pt-BR'].tasks = { title: 'Suas tarefas', noOpen: 'Nenhuma tarefa aberta.', completedTitle: 'Concluídas', noCompleted: 'Nenhuma tarefa concluída.' }

i18n.translations.en.top = { motiv: "Let's keep the streak going 🔥" }
i18n.translations['pt-BR'].top = { motiv: 'Vamos manter a consistência 🔥' }

i18n.translations.en.createTask = {
  title: 'Title',
  placeholderTitle: 'e.g. Buy groceries',
  description: 'Description',
  placeholderDescription: 'Task details',
  priority: 'Priority',
  prioLow: 'Low',
  prioMedium: 'Medium',
  prioHigh: 'High',
  duration: 'Duration',
  selectDuration: 'Select duration',
  selectDurationTitle: 'Select duration',
  customDurationPlaceholder: 'Duration in minutes (e.g. 150)',
  cancel: 'Cancel',
  save: 'Save',
  otherDuration: 'Other duration...',
  remove: 'Remove',
  select: 'Select',
  selectDateTime: 'Select date & time',
  removeTime: 'Remove time',
  addTime: 'Add time',
  saveTask: 'Save task',
}

i18n.translations['pt-BR'].createTask = {
  title: 'Título',
  placeholderTitle: 'Ex: Comprar mantimentos',
  description: 'Descrição',
  placeholderDescription: 'Detalhes da tarefa',
  priority: 'Prioridade',
  prioLow: 'Baixa',
  prioMedium: 'Média',
  prioHigh: 'Alta',
  duration: 'Duração',
  selectDuration: 'Selecionar duração',
  selectDurationTitle: 'Selecionar duração',
  customDurationPlaceholder: 'Duração em minutos (ex: 150)',
  cancel: 'Cancelar',
  save: 'Salvar',
  otherDuration: 'Outra duração...',
  remove: 'REMOVER',
  select: 'SELECIONAR',
  selectDateTime: 'Selecionar Data e Hora',
  removeTime: 'REMOVER HORÁRIO',
  addTime: 'ADICIONAR HORÁRIO',
  saveTask: 'Salvar tarefa',
}

i18n.translations.en.createHabit = {
  title: 'Habit name',
  placeholderTitle: 'e.g. Drink 2L of water, 8 cups',
  category: 'Category',
  placeholderCategory: 'e.g. Routine, Health, Reading',
  chooseIcon: 'Choose an icon',
  chooseColor: 'Choose a color',
  frequency: 'Frequency',
  freqDaily: 'Daily',
  freqWeekly: 'Weekly',
  freqCustom: 'Custom',
  goal: 'Goal',
  placeholderValue: 'Value',
  placeholderUnit: 'Unit',
  newHabit: 'New habit',
  save: 'Save'
  ,
  suggestions: 'Suggestions'
}

i18n.translations.en.onboarding = {
  page1: { title: 'Welcome to Orbe', desc: 'Build consistent habits and track tasks with gentle nudges and progress.' },
  page2: { title: 'Create Habits', desc: 'Add habits with goals, colors and icons to make them yours.' },
  page3: { title: 'Track Tasks', desc: 'Plan your day and keep momentum, tick things off as you go.' },
  skip: 'Skip',
  back: 'Back',
  next: 'Next',
  start: 'Get Started',
}

i18n.translations['pt-BR'].createHabit = {
  title: 'Nome do hábito',
  placeholderTitle: 'Ex: Beber 2L de água, 8 copos',
  category: 'Categoria',
  placeholderCategory: 'Ex: Rotina, Saúde, Leitura',
  chooseIcon: 'Escolha um ícone',
  chooseColor: 'Escolha uma cor',
  frequency: 'Frequência',
  freqDaily: 'Diário',
  freqWeekly: 'Semanal',
  freqCustom: 'Personalizado',
  goal: 'Meta',
  placeholderValue: 'Valor',
  placeholderUnit: 'Unidade',
  newHabit: 'Novo hábito',
  save: 'Salvar'
  ,
  suggestions: 'Sugestões'
}

i18n.translations['pt-BR'].onboarding = {
  page1: { title: 'Bem-vindo ao Orbe', desc: 'Crie hábitos consistentes e acompanhe tarefas com lembretes gentis e progresso.' },
  page2: { title: 'Crie Hábitos', desc: 'Adicione hábitos com metas, cores e ícones para torná-los seus.' },
  page3: { title: 'Acompanhe Tarefas', desc: 'Planeje seu dia e mantenha o ritmo, marque as tarefas à medida que avança.' },
  skip: 'Pular',
  back: 'Voltar',
  next: 'Próximo',
  start: 'Começar',
}

i18n.translations.en.habit = {
  notFound: 'Habit not found.',
  resetTitle: 'Reset history',
  resetConfirm: 'Reset this habit history and start from zero (from today)?',
  resetSuccess: 'History reset. Starting from zero today.',
  removeTitle: 'Remove habit',
  removeConfirm: 'Remove this habit permanently?',
  removeSuccess: 'Habit removed',
  sequence: 'Streak',
  daysLabel: 'days',
  best: 'Best',
  frequency: 'Frequency',
  freqDaily: 'Daily',
  freqWeekly: 'Weekly',
  freqCustom: 'Custom',
  history: 'History',
  goal: 'Goal',
  today: 'Today',
  placeholder_howMany: 'How many?',
  register: 'Register',
  update: 'Update',
  progressToday: 'Progress today: {{percent}}% ({{value}}/{{goal}} {{unit}})'
}

i18n.translations['pt-BR'].habit = {
  notFound: 'Hábito não encontrado.',
  resetTitle: 'Resetar histórico',
  resetConfirm: 'Deseja resetar o histórico deste hábito e começar do zero (a partir de hoje)?',
  resetSuccess: 'Histórico resetado. Começando do zero a partir de hoje.',
  removeTitle: 'Remover hábito',
  removeConfirm: 'Deseja remover este hábito permanentemente?',
  removeSuccess: 'Hábito removido',
  sequence: 'Sequência',
  daysLabel: 'dias',
  best: 'Melhor',
  frequency: 'Frequência',
  freqDaily: 'Diário',
  freqWeekly: 'Semanal',
  freqCustom: 'Personalizado',
  history: 'Histórico',
  goal: 'Meta',
  today: 'Hoje',
  placeholder_howMany: 'Quantos?',
  register: 'Registrar',
  update: 'Atualizar',
  progressToday: 'Progresso hoje: {{percent}}% ({{value}}/{{goal}} {{unit}})'
}

i18n.fallbacks = true

if (detectedLocale) i18n.locale = detectedLocale

function _resolveKey(obj: any, path: string) {
  const parts = path.split('.')
  let cur = obj
  for (const p of parts) {
    if (!cur || typeof cur !== 'object' || !(p in cur)) return undefined
    cur = cur[p]
  }
  return cur
}

function fallbackT(key: string, opts?: Record<string, any>) {
  const locale = (i18n && i18n.locale) || detectedLocale || 'en'
  const tryKeys = [] as string[]
  tryKeys.push(locale)
  const langOnly = locale.split('-')[0]
  if (langOnly !== locale) tryKeys.push(langOnly)
  tryKeys.push('en')

  for (const lk of tryKeys) {
    const translations = (i18n && i18n.translations && i18n.translations[lk]) || (lk === 'en' ? (typeof en !== 'undefined' ? en : undefined) : undefined)
    if (!translations) continue
    const v = _resolveKey(translations, key)
    if (typeof v === 'string') {
      if (!opts) return v
      return v.replace(/{{\s*(\w+)\s*}}/g, (_, k) => (opts && k in opts ? String(opts[k]) : ''))
    }
  }
  return key
}

export const t = (key: string, opts?: Record<string, any>) => {
  if (i18n && typeof i18n.t === 'function') return i18n.t(key, opts)
  return fallbackT(key, opts)
}

export default i18n
