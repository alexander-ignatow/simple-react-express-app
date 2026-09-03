import { useState } from 'react'

export interface Quote {
  text: string
  author: string
  timestamp: string
}

const MISSING_API_TOKEN_MESSAGE =
  'Missing API token. Set VITE_API_TOKEN in client/.env.local, then restart the client.'

interface UseQuoteReturn {
  quote: Quote | null
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
  const [error, setError] = useState<string | null>(isConfigured ? null : MISSING_API_TOKEN_MESSAGE)
  const [isLoading, setIsLoading] = useState(false)

  const fetchQuote = async (author?: string): Promise<void> => {
    if (!isConfigured) {
      setError(MISSING_API_TOKEN_MESSAGE)
      return
    }

    setIsLoading(true)
    setError(null)

    const query = author && author.trim().length > 0 ? `?author=${encodeURIComponent(author)}` : ''

    try {
      const response = await fetch(`${apiUrl}/quote${query}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        // The API reports an unknown author as 404 with `{ error }`; prefer that message.
        const body = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(body?.error ?? `API request failed: ${response.statusText}`)
      }

      const data = (await response.json()) as Quote
      setQuote(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch quote'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return { quote, error, isConfigured, isLoading, fetchQuote }
}
