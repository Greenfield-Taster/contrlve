export function formatFollowers(count: number): string {
  if (count >= 1_000_000) {
    const millions = (count / 1_000_000).toFixed(1).replace(/\.0$/, '')
    return `${millions.replace('.', ',')} млн`
  }
  if (count >= 1000) {
    // Десяті, а не ціле: округлення до тисяч зробило б з 3773 «4 тис.»
    const thousands = (count / 1000).toFixed(1).replace(/\.0$/, '')
    return `${thousands.replace('.', ',')} тис.`
  }
  return String(count)
}
