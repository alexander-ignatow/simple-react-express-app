import { useCallback, useEffect, useState } from 'react'

export interface Quote {
  text: string
  author: string
  timestamp: string
}

const MISSING_API_TOKEN_MESSAGE =
  'Missing API token. Set VITE_API_TOKEN in client/.env.local, then restart the client.'

interface AuthorsResponse {
  authors: string[]
}

interface ErrorResponse {
  error?: string
}

/** Prefers the server's JSON error message, falling back to the status text. */
const readErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as ErrorResponse
    if (data.error) {
      return data.error
    }
  } catch {
    // Non-JSON error body; fall through to the status text.
  }

  return `API request failed: ${response.statusText}`
}

interface UseQuoteReturn {
  quote: Quote | null
  authors: string[]
  error: string | null
  isConfigured: boolean
  isLoading: boolean
  fetchQuote: (author?: string) => Promise<void>
}

export const useQuote = (): UseQuoteReturn => {
  const apiUrl = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3001'
  const apiToken = (import.meta.env.VITE_API_TOKEN as string | undefined)?.trim() ?? ''
  const isConfigured = apiToken.length > 0
  const [quote, setQuote] = useState<Quote | null>(null)
  const [authors, setAuthors] = useState<string[]>([])
  const [error, setError] = useState<string | null>(isConfigured ? null : MISSING_API_TOKEN_MESSAGE)
  const [isLoading, setIsLoading] = useState(false)

  const authHeaders = useCallback(
    (): HeadersInit => ({
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    }),
    [apiToken]
  )

  // Populate the author selector once, from the server's own quote list.
  useEffect((): void => {
    if (!isConfigured) {
      return
    }

    const loadAuthors = async (): Promise<void> => {
      try {
        const response = await fetch(`${apiUrl}/authors`, {
          method: 'GET',
          headers: authHeaders(),
        })

        if (!response.ok) {
          return
        }

        const data = (await response.json()) as AuthorsResponse
        setAuthors(data.authors)
      } catch {
        // A missing author list only costs the filter, so leave the UI usable.
      }
    }

    void loadAuthors()
  }, [apiUrl, authHeaders, isConfigured])

  const fetchQuote = useCallback(
    async (author?: string): Promise<void> => {
      if (!isConfigured) {
        setError(MISSING_API_TOKEN_MESSAGE)
        return
      }

      setIsLoading(true)
      setError(null)

      const query = author ? `?author=${encodeURIComponent(author)}` : ''

      try {
        const response = await fetch(`${apiUrl}/quote${query}`, {
          method: 'GET',
          headers: authHeaders(),
        })

        if (!response.ok) {
          throw new Error(await readErrorMessage(response))
        }

        const data = (await response.json()) as Quote
        setQuote(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch quote'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [apiUrl, authHeaders, isConfigured]
  )

  return { quote, authors, error, isConfigured, isLoading, fetchQuote }
}
