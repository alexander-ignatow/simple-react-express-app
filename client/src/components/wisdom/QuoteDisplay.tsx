import type { Quote } from '@/hooks/useQuote'

interface QuoteDisplayProps {
  quote: Quote
  filterLabel: string
}

export const QuoteDisplay = ({ quote, filterLabel }: QuoteDisplayProps): React.JSX.Element => {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-0.5 select-none font-display text-[68px] leading-none text-primary/22 sm:left-[18px] sm:text-[88px]"
      >
        &ldquo;
      </span>
      <div className="flex animate-quote-in flex-col gap-6">
        <p className="m-0 text-pretty font-display text-quote-sm font-normal sm:text-quote">
          {quote.text}
        </p>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-author font-semibold">{quote.author}</span>
          <span className="font-mono text-meta uppercase text-muted-foreground">{filterLabel}</span>
        </div>
      </div>
    </>
  )
}
