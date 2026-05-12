export function sortTasks(list: any[]) {
  const priorityScore = (p: any) => (p === 'high' ? 0 : p === 'medium' ? 1 : 2)
  const dueTs = (t: any) => {
    if (!t?.dueAt) return null
    try {
      if (t.allDay) return new Date((t.dueAt as string) + 'T00:00:00').getTime()
      return new Date(t.dueAt).getTime()
    } catch (e) {
      return null
    }
  }

  const dayKey = (ts: number | null) => (ts === null ? null : new Date(ts).setHours(0, 0, 0, 0))

  return [...list].sort((a, b) => {
    const da = dueTs(a)
    const db = dueTs(b)

    if (da !== null && db !== null) {
      const dayA = dayKey(da)
      const dayB = dayKey(db)
      if (dayA === dayB) {
        const pa = priorityScore(a.priority)
        const pb = priorityScore(b.priority)
        if (pa !== pb) return pa - pb
        if (da !== db) return da - db
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      return (dayA as number) - (dayB as number)
    }

    if (da !== null) return -1
    if (db !== null) return 1

    const pa = priorityScore(a.priority)
    const pb = priorityScore(b.priority)
    if (pa !== pb) return pa - pb
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })
}

export default sortTasks
