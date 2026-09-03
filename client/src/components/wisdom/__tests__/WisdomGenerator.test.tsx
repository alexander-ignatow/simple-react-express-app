import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { WisdomGenerator } from '../WisdomGenerator'

// vitest runs without `globals: true`, so Testing Library's auto-cleanup is not installed
// and renders would otherwise pile up in the same document between tests.
afterEach(() => {
  cleanup()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('WisdomGenerator', () => {
  it('renders the heading and button', () => {
    vi.stubEnv('VITE_API_TOKEN', 'demo-token')

    render(<WisdomGenerator />)

    expect(screen.getByRole('heading', { name: 'Wisdom Generator' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Generate Some Wisdom' })).toBeTruthy()
  })

  it('defaults the author selector to "Any author"', () => {
    vi.stubEnv('VITE_API_TOKEN', 'demo-token')

    render(<WisdomGenerator />)

    expect(screen.getByLabelText('Author')).toHaveProperty('value', '')
    expect(screen.getByRole('option', { name: 'Any author' })).toHaveProperty('selected', true)
  })

  it('requests no author query while the selector is on "Any author"', async () => {
    vi.stubEnv('VITE_API_TOKEN', 'demo-token')
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ text: 'A quote', author: 'Yoda', timestamp: 'now' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<WisdomGenerator />)
    fireEvent.click(screen.getByRole('button', { name: 'Generate Some Wisdom' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/quote', expect.anything())
    })
  })

  it('requests the selected author and shows the API error for an unknown one', async () => {
    vi.stubEnv('VITE_API_TOKEN', 'demo-token')
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
      json: () => Promise.resolve({ error: 'No quotes found for author: Batman' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<WisdomGenerator />)
    fireEvent.change(screen.getByLabelText('Author'), { target: { value: 'Batman' } })
    fireEvent.click(screen.getByRole('button', { name: 'Generate Some Wisdom' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:3001/quote?author=Batman',
        expect.anything(),
      )
    })
    expect(await screen.findByText('No quotes found for author: Batman')).toBeTruthy()
  })

  it('disables the button when no API token is configured', () => {
    vi.stubEnv('VITE_API_TOKEN', '')

    render(<WisdomGenerator />)

    expect(screen.getByRole('button', { name: 'API Token Required' })).toHaveProperty('disabled', true)
  })
})