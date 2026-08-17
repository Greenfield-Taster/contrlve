export function formatFollowers(count: number): string {
  if (count >= 1_000_000) {
    const millions = (count / 1_000_000).toFixed(1).replace(/\.0$/, '')
    return `${millions.replace('.', ',')} млн`
  }
  if (count >= 1000) {
    return `${Math.round(count / 1000)} тис.`
  }
  return String(count)
}
