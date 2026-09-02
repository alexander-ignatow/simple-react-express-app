import type { Theme } from '@/hooks/useTheme'

interface ThemeOption {
  value: Theme
  label: string
}

const THEME_OPTIONS: ThemeOption[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' },
]

// Metadata styling, per the design language: mono, uppercase, tracked wide, muted.
// The selected segment uses `secondary` rather than the brass accent, which the
// design reserves for the primary button, the quote mark and the loading dots.
const SEGMENT_CLASS =
  'inline-flex h-7 cursor-pointer items-center rounded-[6px] px-3 font-mono text-meta uppercase text-muted-foreground transition-colors duration-[160ms] ease-design hover:text-foreground peer-checked:bg-secondary peer-checked:text-foreground peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring/70'

interface ThemeSwitcherProps {
  theme: Theme
  onChange: (theme: Theme) => void
}

export const ThemeSwitcher = ({ theme, onChange }: ThemeSwitcherProps): React.JSX.Element => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value as Theme)
  }

  return (
    <fieldset className="inline-flex gap-px rounded-control border border-border p-[3px]">
      {/* Native radios carry the grouping and arrow-key navigation for free. */}
      <legend className="sr-only">Theme</legend>
      {THEME_OPTIONS.map((option) => (
        <label key={option.value}>
          <input
            type="radio"
            name="theme"
            value={option.value}
            checked={option.value === theme}
            onChange={handleChange}
            className="peer sr-only"
          />
          <span className={SEGMENT_CLASS}>{option.label}</span>
        </label>
      ))}
    </fieldset>
  )
}
