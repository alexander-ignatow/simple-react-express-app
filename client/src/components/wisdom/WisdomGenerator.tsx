import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { ANY_AUTHOR, AuthorSelect } from '@/components/wisdom/AuthorSelect'
import { ErrorMessage } from '@/components/wisdom/ErrorMessage'
import { LoadingMessage } from '@/components/wisdom/LoadingMessage'
import { QuoteDisplay } from '@/components/wisdom/QuoteDisplay'
import { useQuote } from '@/hooks/useQuote'

export const WisdomGenerator = (): React.JSX.Element => {
  const { quote, authors, error, isConfigured, isLoading, fetchQuote } = useQuote()
  const [selectedAuthor, setSelectedAuthor] = useState<string>(ANY_AUTHOR)

  const handleGenerateClick = (): void => {
    void fetchQuote(selectedAuthor === ANY_AUTHOR ? undefined : selectedAuthor)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container mx-auto p-8 max-w-2xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
              Wisdom Generator
            </h1>
            <p className="text-muted-foreground">Receive a dose of wisdom with every click</p>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            {/* Quote Display */}
            {isLoading && <LoadingMessage />}
            {!isLoading && quote && <QuoteDisplay quote={quote} />}
            {!isLoading && !quote && (
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
                <p className="text-slate-600 dark:text-slate-400 text-center">
                  Press the button to generate some wisdom
                </p>
              </div>
            )}

            {/* Error Display */}
            {error && <ErrorMessage message={error} />}

            {/* Author Filter */}
            <AuthorSelect
              authors={authors}
              value={selectedAuthor}
              disabled={isLoading || !isConfigured}
              onChange={setSelectedAuthor}
            />

            {/* Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleGenerateClick}
                disabled={isLoading || !isConfigured}
                className="px-8"
              >
                {isLoading
                  ? 'Generating...'
                  : isConfigured
                    ? 'Generate Some Wisdom'
                    : 'API Token Required'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
