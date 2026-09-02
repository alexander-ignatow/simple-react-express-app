import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { THEME_STORAGE_KEY, useTheme } from '@/hooks/useTheme'

import { ThemeSwitcher } from '../ThemeSwitcher'

// jsdom provides neither localStorage nor matchMedia here, so both are stubbed.
const createStorage = (seed?: string): Storage => {
  const map = new Map<string, string>(seed === undefined ? [] : [[THEME_STORAGE_KEY, seed]])

  return {
    getItem: (key: string): string | null => map.get(key) ?? null,
    setItem: (key: string, value: string): void => {
      map.set(key, value)
    },
    removeItem: (key: string): void => {
      map.delete(key)
    },
    clear: (): void => {
      map.clear()
    },
    key: (index: number): string | null => [...map.keys()][index] ?? null,
    get length(): number {
      return map.size
    },
  }
}

let listeners: (() => void)[] = []

const stubMatchMedia = (matches: boolean): void => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches,
    media: query,
    addEventListener: (_: string, handler: () => void): void => {
      listeners.push(handler)
    },
    removeEventListener: (_: string, handler: () => void): void => {
      listeners = listeners.filter((entry) => entry !== handler)
    },
  }))
}

// The hook is only meaningful through a component, so drive it from a harness.
const Harness = (): React.JSX.Element => {
  const { theme, setTheme } = useTheme()
  return <ThemeSwitcher theme={theme} onChange={setTheme} />
}

const isDark = (): boolean => document.documentElement.classList.contains('dark')

beforeEach(() => {
  listeners = []
  vi.stubGlobal('localStorage', createStorage())
  stubMatchMedia(false)
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  document.documentElement.classList.remove('dark')
})

describe('ThemeSwitcher', () => {
  it('offers exactly three modes and defaults to Auto', () => {
    render(<Harness />)

    expect(screen.getAllByRole('radio')).toHaveLength(3)
    expect(screen.getByRole('radio', { name: 'Auto' })).toHaveProperty('checked', true)
    expect(screen.getByRole('radio', { name: 'Light' })).toHaveProperty('checked', false)
    expect(screen.getByRole('radio', { name: 'Dark' })).toHaveProperty('checked', false)
  })

  it('applies and persists Dark', () => {
    render(<Harness />)

    fireEvent.click(screen.getByRole('radio', { name: 'Dark' }))

    expect(isDark()).toBe(true)
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('applies and persists Light even when the OS prefers dark', () => {
    stubMatchMedia(true)
    render(<Harness />)

    fireEvent.click(screen.getByRole('radio', { name: 'Light' }))

    expect(isDark()).toBe(false)
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
  })

  it('follows the operating system in Auto', () => {
    stubMatchMedia(true)
    render(<Harness />)

    expect(screen.getByRole('radio', { name: 'Auto' })).toHaveProperty('checked', true)
    expect(isDark()).toBe(true)
  })

  it('reacts to the OS flipping while in Auto', () => {
    stubMatchMedia(false)
    render(<Harness />)
    expect(isDark()).toBe(false)

    stubMatchMedia(true)
    listeners.forEach((handler) => {
      handler()
    })

    expect(isDark()).toBe(true)
  })

  it('restores the persisted choice on mount', () => {
    vi.stubGlobal('localStorage', createStorage('dark'))

    render(<Harness />)

    expect(screen.getByRole('radio', { name: 'Dark' })).toHaveProperty('checked', true)
    expect(isDark()).toBe(true)
  })

  it('stops following the OS once an explicit mode is chosen', () => {
    stubMatchMedia(false)
    render(<Harness />)

    fireEvent.click(screen.getByRole('radio', { name: 'Light' }))

    stubMatchMedia(true)
    listeners.forEach((handler) => {
      handler()
    })

    expect(isDark()).toBe(false)
  })
})
