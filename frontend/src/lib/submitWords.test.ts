import { beforeEach, describe, expect, it, vi } from 'vitest'
import { submitWords } from './submitWords'

describe('submitWords', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.unstubAllGlobals()
  })

  it('складає рядок зі слів і копіює його', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    const result = await submitWords([' пилосос ', 'валідол', 'шифер'])

    expect(result.text).toBe('КОНТРЛВЕ, мої три слова: пилосос, валідол, шифер')
    expect(writeText).toHaveBeenCalledWith(result.text)
    expect(result.copied).toBe(true)
  })

  it('рахує спробу навіть коли буфер недоступний', async () => {
    vi.stubGlobal('navigator', {})

    const result = await submitWords(['пилосос', 'валідол', 'шифер'])

    expect(result.copied).toBe(false)
    expect(result.attempts).toBe(1)
  })

  it('рахує кожну спробу', async () => {
    vi.stubGlobal('navigator', {})
    await submitWords(['а', 'б', 'в'])
    const second = await submitWords(['а', 'б', 'в'])
    expect(second.attempts).toBe(2)
  })

  it('переживає відмову в дозволі на буфер', async () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('відмовлено')) },
    })

    const result = await submitWords(['пилосос', 'валідол', 'шифер'])
    expect(result.copied).toBe(false)
  })
})
