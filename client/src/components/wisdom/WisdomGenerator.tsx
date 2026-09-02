import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { ANY_AUTHOR, AuthorSelect } from '@/components/wisdom/AuthorSelect'
import { ErrorMessage } from '@/components/wisdom/ErrorMessage'
import { LoadingMessage } from '@/components/wisdom/LoadingMessage'
import { QuoteDisplay } from '@/components/wisdom/QuoteDisplay'
import { ThemeSwitcher } from '@/components/wisdom/ThemeSwitcher'
import { useQuote } from '@/hooks/useQuote'
import { useTheme } from '@/hooks/useTheme'

const ANY_AUTHOR_LABEL = 'Any author'

export const WisdomGenerator = (): React.JSX.Element => {
  const { quote, authors, error, isConfigured, isLoading, fetchQuote } = useQuote()
  const { theme, setTheme } = useTheme()
  const [selectedAuthor, setSelectedAuthor] = useState<string>(ANY_AUTHOR)

  const handleGenerateClick = (): void => {
    void fetchQuote(selectedAuthor === ANY_AUTHOR ? undefined : selectedAuthor)
  }

  // The panel holds exactly one of four contents, so a stale quote is never
  // shown next to a failure.
  const renderPanelContent = (): React.JSX.Element => {
    if (isLoading) {
      return <LoadingMessage />
    }

    if (error) {
      return <ErrorMessage message={error} />
    }

    if (quote) {
      return (
        <QuoteDisplay
          quote={quote}
          filterLabel={selectedAuthor === ANY_AUTHOR ? ANY_AUTHOR_LABEL : selectedAuthor}
        />
      )
    }

    return (
      <div className="flex flex-col gap-3">
        <p className="m-0 font-display text-empty italic text-muted-foreground">
          Press the button to generate some wisdom
        </p>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-6 py-16">
      {/* Chrome, not content: kept outside the 640px column the mock composes. */}
      <div className="absolute right-6 top-6">
        <ThemeSwitcher theme={theme} onChange={setTheme} />
      </div>

      <div className="mx-auto flex w-full max-w-column flex-col gap-6 font-ui text-foreground sm:gap-8">
        {/* Header */}
        <div className="flex flex-col gap-3 text-center">
          <h1 className="m-0 font-display text-heading-sm font-normal sm:text-heading">
            Wisdom Generator
          </h1>
          <p className="m-0 font-mono text-meta uppercase text-muted-foreground">
            Receive a dose of wisdom with every click
          </p>
        </div>

        {/* One panel, four possible contents */}
        <div className="relative flex min-h-[168px] flex-col justify-center rounded-panel border border-border bg-card px-6 pb-6 pt-8 text-card-foreground shadow-panel sm:min-h-[196px] sm:px-8 sm:pb-8 sm:pt-11">
          {renderPanelContent()}
        </div>

        {/* Controls */}
        <div className="flex flex-col justify-center gap-2 sm:flex-row">
          <AuthorSelect
            authors={authors}
            value={selectedAuthor}
            disabled={isLoading || !isConfigured}
            onChange={setSelectedAuthor}
          />
          <Button
            onClick={handleGenerateClick}
            disabled={isLoading || !isConfigured}
            // tailwind-merge cannot classify custom theme keys, so `rounded-control`
            // and `text-control` here would fail to displace the shadcn base's
            // `rounded-md`/`text-primary-foreground`. Arbitrary values carry the units
            // twMerge needs to group them correctly.
            className="h-12 w-full rounded-[8px] bg-primary px-6 text-[14px] font-semibold tracking-[0.005em] text-primary-foreground shadow-primary-glow transition-[background-color,transform] duration-[160ms] ease-design hover:bg-primary/88 hover:not-disabled:-translate-y-px active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring/70 disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:h-[46px] sm:w-auto"
          >
            {isLoading ? 'Generating...' : isConfigured ? 'Generate Some Wisdom' : 'API Token Required'}
          </Button>
        </div>
      </div>
    </div>
  )
}
