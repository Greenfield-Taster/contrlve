import { beforeEach, describe, expect, it, vi } from 'vitest'
import { bumpAttempts, readAttempts } from './attempts'

describe('attempts', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('спочатку нуль', () => {
    expect(readAttempts()).toBe(0)
  })

  it('рахує спроби', () => {
    expect(bumpAttempts()).toBe(1)
    expect(bumpAttempts()).toBe(2)
    expect(readAttempts()).toBe(2)
  })

  it('не падає на сміттєвому значенні', () => {
    localStorage.setItem('contrlve.attempts', 'не число')
    expect(readAttempts()).toBe(0)
  })

  it('не падає, коли localStorage недоступний', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('заблоковано')
    })
    expect(readAttempts()).toBe(0)
    spy.mockRestore()
  })
})
