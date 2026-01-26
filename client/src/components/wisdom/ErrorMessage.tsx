interface ErrorMessageProps {
  message: string
}

export const ErrorMessage = ({ message }: ErrorMessageProps): React.JSX.Element => {
  return (
    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6">
      <p className="text-red-700 dark:text-red-300 text-center">{message}</p>
    </div>
  )
}
