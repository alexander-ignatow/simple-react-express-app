import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark' | 'auto'

/**
 * Also read by the pre-paint script in `client/index.html`. Changing it means
 * changing both, or dark users get a light flash on every reload.
 */
export const THEME_STORAGE_KEY = 'wisdom-theme'

const DARK_QUERY = '(prefers-color-scheme: dark)'

const isTheme = (value: unknown): value is Theme =>
  value === 'light' || value === 'dark' || value === 'auto'

// `localStorage` and `matchMedia` are both absent in some embedding contexts
// (jsdom among them), where reading them throws rather than returning undefined.
const readStoredTheme = (): Theme => {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(stored) ? stored : 'auto'
  } catch {
    return 'auto'
  }
}

const storeTheme = (theme: Theme): void => {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Private browsing or a disabled store: the choice just will not persist.
  }
}

const prefersDark = (): boolean => {
  try {
    return window.matchMedia(DARK_QUERY).matches
  } catch {
    return false
  }
}

const applyTheme = (theme: Theme): void => {
  const isDark = theme === 'dark' || (theme === 'auto' && prefersDark())
  document.documentElement.classList.toggle('dark', isDark)
}

const watchSystemTheme = (onChange: () => void): (() => void) => {
  try {
    const query = window.matchMedia(DARK_QUERY)
    query.addEventListener('change', onChange)
    return (): void => {
      query.removeEventListener('change', onChange)
    }
  } catch {
    return (): void => {
      // Nothing to unsubscribe from.
    }
  }
}

interface UseThemeReturn {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useTheme = (): UseThemeReturn => {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)

  useEffect((): (() => void) => {
    applyTheme(theme)

    // Only Auto tracks the OS; an explicit choice ignores it.
    if (theme !== 'auto') {
      return (): void => {
        // No subscription to tear down.
      }
    }

    return watchSystemTheme((): void => {
      applyTheme('auto')
    })
  }, [theme])

  const setTheme = useCallback((next: Theme): void => {
    storeTheme(next)
    setThemeState(next)
  }, [])

  return { theme, setTheme }
}
