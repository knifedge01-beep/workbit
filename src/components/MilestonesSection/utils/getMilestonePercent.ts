export function getMilestonePercent(progress: number, total: number): number {
  if (total <= 0) {
    return 0
  }

  return Math.round((progress / total) * 100)
}
