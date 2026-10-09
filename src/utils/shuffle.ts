export function shuffledBag<T>(items: readonly T[], previous?: T): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }

  if (result.length > 1 && previous !== undefined && result[0] === previous) {
    const swapIndex = 1 + Math.floor(Math.random() * (result.length - 1))
    ;[result[0], result[swapIndex]] = [result[swapIndex], result[0]]
  }
  return result
}

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const remainder = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${minutes}:${remainder}`
}
