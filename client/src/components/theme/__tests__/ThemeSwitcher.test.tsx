import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ThemeSwitcher } from '../ThemeSwitcher'

type SystemThemeController = {
  emitChange: (matches: boolean) => void
}

const stubSystemTheme = (initialMatches: boolean): SystemThemeController => {
  let matches = initialMatches
  const listeners = new Set<(event: MediaQueryListEvent) => void>()
  const storedValues = new Map<string, string>()
  const mediaQuery = {
    get matches(): boolean {
      return matches
    },
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void): void => {
      listeners.add(listener)
    },
    removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void): void => {
      listeners.delete(listener)
    },
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }

  vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery))
  vi.stubGlobal('localStorage', {
    getItem: (key: string): string | null => storedValues.get(key) ?? null,
    setItem: (key: string, value: string): void => {
      storedValues.set(key, value)
    },
    clear: (): void => {
      storedValues.clear()
    },
  })

  return {
    emitChange: (nextMatches: boolean): void => {
      matches = nextMatches
      listeners.forEach((listener) => { listener({ matches } as MediaQueryListEvent) })
    },
  }
}

afterEach(() => {
  cleanup()
  document.documentElement.classList.remove('dark')
  vi.unstubAllGlobals()
})

describe('ThemeSwitcher', () => {
  it('uses the operating system preference while Auto is selected', () => {
    stubSystemTheme(true)

    render(<ThemeSwitcher />)

    expect(screen.getByRole('button', { name: 'Auto' }).getAttribute('aria-pressed')).toBe('true')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(window.localStorage.getItem('wisdom-theme')).toBe('auto')
  })

  it('applies and persists an explicit theme selection', () => {
    stubSystemTheme(true)

    render(<ThemeSwitcher />)
    fireEvent.click(screen.getByRole('button', { name: 'Light' }))

    expect(screen.getByRole('button', { name: 'Light' }).getAttribute('aria-pressed')).toBe('true')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(window.localStorage.getItem('wisdom-theme')).toBe('light')

    fireEvent.click(screen.getByRole('button', { name: 'Dark' }))

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(window.localStorage.getItem('wisdom-theme')).toBe('dark')
  })

  it('updates the resolved theme when the system preference changes in Auto mode', () => {
    const systemTheme = stubSystemTheme(false)

    render(<ThemeSwitcher />)
    systemTheme.emitChange(true)

    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})