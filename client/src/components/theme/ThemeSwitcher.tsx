import { Monitor, Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

type ThemeMode = 'light' | 'dark' | 'auto'

const THEME_STORAGE_KEY = 'wisdom-theme'
const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)'

const isThemeMode = (value: string | null): value is ThemeMode =>
  value === 'light' || value === 'dark' || value === 'auto'

const getInitialThemeMode = (): ThemeMode => {
  const storedThemeMode = window.localStorage.getItem(THEME_STORAGE_KEY)
  return isThemeMode(storedThemeMode) ? storedThemeMode : 'auto'
}

export const ThemeSwitcher = (): React.JSX.Element => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialThemeMode)

  useEffect(() => {
    const mediaQuery = window.matchMedia(DARK_MEDIA_QUERY)
    const applyTheme = (): void => {
      const isDark = themeMode === 'dark' || (themeMode === 'auto' && mediaQuery.matches)
      document.documentElement.classList.toggle('dark', isDark)
    }

    const handleSystemThemeChange = (): void => {
      if (themeMode === 'auto') {
        applyTheme()
      }
    }

    applyTheme()
    mediaQuery.addEventListener('change', handleSystemThemeChange)
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode)

    return (): void => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [themeMode])

  return (
    <div className="theme-switcher" aria-label="Color theme" role="group">
      <button
        type="button"
        className="theme-option"
        aria-pressed={themeMode === 'light'}
        onClick={() => { setThemeMode('light') }}
      >
        <Sun aria-hidden="true" size={14} strokeWidth={1.8} />
        <span>Light</span>
      </button>
      <button
        type="button"
        className="theme-option"
        aria-pressed={themeMode === 'dark'}
        onClick={() => { setThemeMode('dark') }}
      >
        <Moon aria-hidden="true" size={14} strokeWidth={1.8} />
        <span>Dark</span>
      </button>
      <button
        type="button"
        className="theme-option"
        aria-pressed={themeMode === 'auto'}
        onClick={() => { setThemeMode('auto') }}
      >
        <Monitor aria-hidden="true" size={14} strokeWidth={1.8} />
        <span>Auto</span>
      </button>
    </div>
  )
}