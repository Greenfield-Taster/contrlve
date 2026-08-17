/** Копіює текст у буфер. Повертає false, якщо буфер недоступний або відмовив. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (!navigator?.clipboard?.writeText) return false
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
