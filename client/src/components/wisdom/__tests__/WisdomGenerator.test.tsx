import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { WisdomGenerator } from '../WisdomGenerator'

const AUTHORS = ['Batman', 'Yoda']

const jsonResponse = (body: unknown, init?: ResponseInit): Response =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })

const fetchMock = vi.fn()
let requestedUrls: string[] = []

beforeEach(() => {
  requestedUrls = []
  fetchMock.mockReset()
  fetchMock.mockImplementation((url: string) => {
    requestedUrls.push(url)

    if (url.includes('/authors')) {
      return Promise.resolve(jsonResponse({ authors: AUTHORS }))
    }

    return Promise.resolve(
      jsonResponse({ text: 'A quote', author: 'Batman', timestamp: '2026-01-01T00:00:00.000Z' })
    )
  })
  vi.stubGlobal('fetch', fetchMock)
})

// Vitest `globals` are off in vite.config.ts, so Testing Library's automatic
// cleanup never registers; unmount between tests explicitly.
afterEach(() => {
  cleanup()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('WisdomGenerator', () => {
  it('renders the heading and button', async () => {
    vi.stubEnv('VITE_API_TOKEN', 'demo-token')

    render(<WisdomGenerator />)

    expect(screen.getByRole('heading', { name: 'Wisdom Generator' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Generate Some Wisdom' })).toBeTruthy()
    await waitFor(() => {
      expect(requestedUrls.length).toBeGreaterThan(0)
    })
  })

  it('disables the button when no API token is configured', () => {
    vi.stubEnv('VITE_API_TOKEN', '')

    render(<WisdomGenerator />)

    expect(screen.getByRole('button', { name: 'API Token Required' })).toHaveProperty('disabled', true)
  })

  it('defaults the author selector to "Any author" and requests a random quote', async () => {
    vi.stubEnv('VITE_API_TOKEN', 'demo-token')
    render(<WisdomGenerator />)

    const select = screen.getByLabelText<HTMLSelectElement>('Author')
    expect(select.value).toBe('')
    expect(screen.getByRole('option', { name: 'Any author' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Generate Some Wisdom' }))

    await waitFor(() => {
      expect(requestedUrls).toContain('http://localhost:3001/quote')
    })
  })

  it('lists the authors from the server and filters by the selected one', async () => {
    vi.stubEnv('VITE_API_TOKEN', 'demo-token')
    render(<WisdomGenerator />)

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Batman' })).toBeTruthy()
    })

    fireEvent.change(screen.getByLabelText('Author'), { target: { value: 'Batman' } })
    fireEvent.click(screen.getByRole('button', { name: 'Generate Some Wisdom' }))

    await waitFor(() => {
      expect(requestedUrls).toContain('http://localhost:3001/quote?author=Batman')
    })
  })

  it('labels the quote with the active filter, not the quote author', async () => {
    vi.stubEnv('VITE_API_TOKEN', 'demo-token')
    fetchMock.mockImplementation((url: string) => {
      requestedUrls.push(url)

      if (url.includes('/authors')) {
        return Promise.resolve(jsonResponse({ authors: AUTHORS }))
      }

      return Promise.resolve(
        jsonResponse({ text: 'A quote', author: 'Yoda', timestamp: '2026-01-01T00:00:00.000Z' })
      )
    })

    render(<WisdomGenerator />)

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Batman' })).toBeTruthy()
    })

    fireEvent.change(screen.getByLabelText('Author'), { target: { value: 'Batman' } })
    fireEvent.click(screen.getByRole('button', { name: 'Generate Some Wisdom' }))

    // Attribution is the quote's own author; the meta beside it is the filter.
    expect(await screen.findByText('Yoda', { selector: 'span' })).toBeTruthy()
    expect(screen.getByText('Batman', { selector: 'span' })).toBeTruthy()
  })

  it('replaces a displayed quote with the error rather than stacking them', async () => {
    vi.stubEnv('VITE_API_TOKEN', 'demo-token')

    render(<WisdomGenerator />)

    fireEvent.click(screen.getByRole('button', { name: 'Generate Some Wisdom' }))
    expect(await screen.findByText('A quote')).toBeTruthy()

    fetchMock.mockImplementation(() =>
      Promise.resolve(jsonResponse({ error: 'Request blew up' }, { status: 500 }))
    )
    fireEvent.click(screen.getByRole('button', { name: 'Generate Some Wisdom' }))

    expect(await screen.findByText('Request blew up')).toBeTruthy()
    expect(screen.queryByText('A quote')).toBeNull()
  })

  it('shows the server error message when the author has no quotes', async () => {
    vi.stubEnv('VITE_API_TOKEN', 'demo-token')
    fetchMock.mockImplementation((url: string) => {
      if (url.includes('/authors')) {
        return Promise.resolve(jsonResponse({ authors: AUTHORS }))
      }

      return Promise.resolve(
        jsonResponse({ error: "No quotes found for author 'Batman'" }, { status: 404 })
      )
    })
    render(<WisdomGenerator />)

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Batman' })).toBeTruthy()
    })

    fireEvent.change(screen.getByLabelText('Author'), { target: { value: 'Batman' } })
    fireEvent.click(screen.getByRole('button', { name: 'Generate Some Wisdom' }))

    expect(await screen.findByText("No quotes found for author 'Batman'")).toBeTruthy()
  })
})
