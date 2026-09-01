import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { WisdomGenerator } from '../WisdomGenerator'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('WisdomGenerator', () => {
  it('renders the heading and button', () => {
    vi.stubEnv('VITE_API_TOKEN', 'demo-token')

    render(<WisdomGenerator />)

    expect(screen.getByRole('heading', { name: 'Wisdom Generator' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Generate Some Wisdom' })).toBeTruthy()
  })

  it('disables the button when no API token is configured', () => {
    vi.stubEnv('VITE_API_TOKEN', '')

    render(<WisdomGenerator />)

    expect(screen.getByRole('button', { name: 'API Token Required' })).toHaveProperty('disabled', true)
  })
})