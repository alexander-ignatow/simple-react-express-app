export const ANY_AUTHOR = ''

interface AuthorSelectProps {
  authors: string[]
  value: string
  disabled: boolean
  onChange: (author: string) => void
}

export const AuthorSelect = ({
  authors,
  value,
  disabled,
  onChange,
}: AuthorSelectProps): React.JSX.Element => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    onChange(event.target.value)
  }

  return (
    <select
      aria-label="Author"
      value={value}
      onChange={handleChange}
      disabled={disabled}
      className="wg-select-caret h-12 w-full appearance-none rounded-control border border-input bg-background pl-4 pr-[38px] font-ui text-control font-medium text-foreground transition-[border-color,color] duration-[160ms] ease-design hover:not-disabled:border-foreground/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring/70 disabled:cursor-not-allowed disabled:opacity-50 sm:h-[46px] sm:w-auto"
    >
      <option value={ANY_AUTHOR}>Any author</option>
      {authors.map((author) => (
        <option key={author} value={author}>
          {author}
        </option>
      ))}
    </select>
  )
}
