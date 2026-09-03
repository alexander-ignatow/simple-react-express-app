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
    <div className="flex flex-col gap-2">
      <label
        htmlFor="author"
        className="text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        Author
      </label>
      <select
        id="author"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
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
