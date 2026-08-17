import { bumpAttempts } from './attempts'
import { copyText } from './clipboard'

export type SubmitResult = {
  text: string
  copied: boolean
  attempts: number
}

/**
 * Єдина точка «відправки» трьох слів. Бекенду немає: слова складаються в
 * рядок і копіюються в буфер обміну. Якщо колись з’явиться збереження,
 * змінюється тільки тіло цієї функції.
 */
export async function submitWords(words: string[]): Promise<SubmitResult> {
  const text = `КОНТРЛВЕ, мої три слова: ${words.map((w) => w.trim()).join(', ')}`
  const copied = await copyText(text)
  const attempts = bumpAttempts()
  return { text, copied, attempts }
}
