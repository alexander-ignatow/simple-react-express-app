export const LoadingMessage = (): React.JSX.Element => {
  return (
    <div className="wg-loading">
      <span className="dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="wg-loading-text">Generating wisdom...</span>
    </div>
  )
}
