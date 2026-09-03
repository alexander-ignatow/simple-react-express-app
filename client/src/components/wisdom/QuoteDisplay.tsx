import type { Quote } from '@/hooks/useQuote'

interface QuoteDisplayProps {
  quote: Quote
}

export const QuoteDisplay = ({ quote }: QuoteDisplayProps): React.JSX.Element => {
  return (
    <>
      <span className="quote-mark" aria-hidden="true">
        &ldquo;
      </span>
      <div className="quote-body">
        <p className="quote-text">{quote.text}</p>
        <div className="quote-attr">
          <span className="quote-author">{quote.author}</span>
          <span className="quote-meta">Any author</span>
        </div>
      </div>
    </>
  )
}
