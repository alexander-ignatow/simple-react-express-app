import { useState } from 'react'

import { AuthorSelect } from '@/components/wisdom/AuthorSelect'
import { ErrorMessage } from '@/components/wisdom/ErrorMessage'
import { LoadingMessage } from '@/components/wisdom/LoadingMessage'
import { QuoteDisplay } from '@/components/wisdom/QuoteDisplay'
import { useQuote } from '@/hooks/useQuote'
import { ANY_AUTHOR } from '@/lib/authors'

export const WisdomGenerator = (): React.JSX.Element => {
  const { quote, error, isConfigured, isLoading, fetchQuote } = useQuote()
  const [author, setAuthor] = useState<string>(ANY_AUTHOR)

  const handleGenerateClick = (): void => {
    void fetchQuote(author)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full px-6 py-8">
        <div className="wg">
          <div className="wg-head">
            <h1 className="wg-title">Wisdom Generator</h1>
            <p className="wg-sub">Receive a dose of wisdom with every click</p>
          </div>

          <div className="wg-panel">
            {isLoading && <LoadingMessage />}
            {!isLoading && quote && !error && <QuoteDisplay quote={quote} />}
            {!isLoading && !quote && !error && (
              <div className="wg-empty">
                <p className="wg-empty-line">Press the button to generate some wisdom</p>
              </div>
            )}
            {error && <ErrorMessage message={error} />}
          </div>

          <div className="wg-controls">
            <AuthorSelect value={author} onChange={setAuthor} disabled={isLoading} />
            <button
              type="button"
              onClick={handleGenerateClick}
              disabled={isLoading || !isConfigured}
              data-loading={isLoading}
              className="wg-btn"
            >
              {isLoading
                ? 'Generating...'
                : isConfigured
                  ? 'Generate Some Wisdom'
                  : 'API Token Required'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
