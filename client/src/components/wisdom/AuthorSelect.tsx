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
    <div className="flex flex-col gap-2">
      <label
        htmlFor="author-select"
        className="text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        Author
      </label>
      <select
        id="author-select"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-100 dark:focus-visible:ring-slate-300"
      >
        <option value={ANY_AUTHOR}>Any author</option>
        {authors.map((author) => (
          <option key={author} value={author}>
            {author}
          </option>
        ))}
      </select>
    </div>
  )
}
