import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AppSection } from './AppSection'
import { appInfo } from '../data/app'

describe('AppSection', () => {
  it('веде в App Store', () => {
    render(<AppSection />)
    expect(screen.getByRole('link', { name: /завантажити в app store/i })).toHaveAttribute(
      'href',
      appInfo.url,
    )
  })

  it('показує оцінку і кількість оцінок з даних', () => {
    render(<AppSection />)
    expect(screen.getByText(/4\.8/)).toBeInTheDocument()
    expect(screen.getByText(/48 оцінок/)).toBeInTheDocument()
  })

  it('чесно каже, що застосунок лише для iPhone', () => {
    render(<AppSection />)
    expect(screen.getByText(/поки лише для iPhone/i)).toBeInTheDocument()
  })

  it('показує всі скріншоти', () => {
    const { container } = render(<AppSection />)
    const shots = container.querySelectorAll('img[src^="/app/screenshot"]')
    expect(shots).toHaveLength(appInfo.screenshots.length)
  })
})
