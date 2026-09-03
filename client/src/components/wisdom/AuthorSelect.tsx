import { ANY_AUTHOR, QUOTE_AUTHORS } from '@/lib/authors'

interface AuthorSelectProps {
  value: string
  disabled?: boolean
  onChange: (author: string) => void
}

export const AuthorSelect = ({
  value,
  disabled = false,
  onChange,
}: AuthorSelectProps): React.JSX.Element => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    onChange(event.target.value)
  }

  return (
    <div className="wg-select-wrap">
      <label htmlFor="author" className="sr-only">
        Author
      </label>
      <select
        id="author"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="wg-select"
      >
        <option value={ANY_AUTHOR}>Any author</option>
        {QUOTE_AUTHORS.map((author) => (
          <option key={author} value={author}>
            {author}
          </option>
        ))}
      </select>
    </div>
  )
}
