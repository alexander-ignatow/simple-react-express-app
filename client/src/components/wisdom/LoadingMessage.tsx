export const LoadingMessage = (): React.JSX.Element => {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden="true" className="flex gap-[5px]">
        <i className="size-[5px] animate-dot rounded-full bg-primary" />
        <i className="size-[5px] animate-dot rounded-full bg-primary [animation-delay:0.15s]" />
        <i className="size-[5px] animate-dot rounded-full bg-primary [animation-delay:0.3s]" />
      </span>
      <span className="font-mono text-meta uppercase text-muted-foreground">
        Generating wisdom...
      </span>
    </div>
  )
}
