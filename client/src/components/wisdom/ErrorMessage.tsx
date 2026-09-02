interface ErrorMessageProps {
  message: string
}

export const ErrorMessage = ({ message }: ErrorMessageProps): React.JSX.Element => {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-meta uppercase text-destructive">Request failed</span>
      <p className="m-0 rounded-panel border border-destructive/45 bg-destructive/7 p-4 font-mono text-error text-foreground">
        {message}
      </p>
    </div>
  )
}
