import { describe, expect, it } from 'vitest'
import { formatFollowers } from './format'

describe('formatFollowers', () => {
  it('форматує тисячі', () => {
    expect(formatFollowers(264000)).toBe('264 тис.')
  })

  it('показує десяті в тисячах', () => {
    expect(formatFollowers(12400)).toBe('12,4 тис.')
  })

  it('не прибільшує число округленням', () => {
    expect(formatFollowers(3401)).toBe('3,4 тис.')
    expect(formatFollowers(7466)).toBe('7,5 тис.')
    expect(formatFollowers(3773)).toBe('3,8 тис.')
  })

  it('форматує мільйони з комою', () => {
    expect(formatFollowers(1200000)).toBe('1,2 млн')
  })

  it('не лишає нуля в дробовій частині мільйонів', () => {
    expect(formatFollowers(2000000)).toBe('2 млн')
  })

  it('малі числа лишає як є', () => {
    expect(formatFollowers(870)).toBe('870')
  })
})
