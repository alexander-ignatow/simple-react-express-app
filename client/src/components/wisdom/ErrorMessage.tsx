interface ErrorMessageProps {
  message: string
}

export const ErrorMessage = ({ message }: ErrorMessageProps): React.JSX.Element => {
  return (
    <div className="wg-error">
      <span className="wg-error-tag">Request failed</span>
      <p className="wg-error-text">{message}</p>
    </div>
  )
}
