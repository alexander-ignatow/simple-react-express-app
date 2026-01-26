import type { Quote } from '@/hooks/useQuote'

interface QuoteDisplayProps {
  quote: Quote
}

export const QuoteDisplay = ({ quote }: QuoteDisplayProps): React.JSX.Element => {
  return (
    <div className="space-y-4">
      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
        <p className="text-lg italic text-slate-900 dark:text-slate-100 mb-4">"{quote.text}"</p>
        <p className="text-right text-sm font-semibold text-slate-700 dark:text-slate-400">
          — {quote.author}
        </p>
      </div>
    </div>
  )
}
