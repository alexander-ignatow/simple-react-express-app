import { useState } from 'react'

export interface Quote {
  text: string
  author: string
  timestamp: string
}

interface UseQuoteReturn {
  quote: Quote | null
  error: string | null
  isLoading: boolean
  fetchQuote: () => Promise<void>
}

export const useQuote = (): UseQuoteReturn => {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchQuote = async (): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      const apiUrl = import.meta.env.VITE_API_URL as string | undefined
      const apiToken = import.meta.env.VITE_API_TOKEN as string | undefined

      if (!apiUrl || !apiToken) {
        throw new Error('API configuration is missing')
      }

      const response = await fetch(`${apiUrl}/quote`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
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

  return { quote, error, isLoading, fetchQuote }
}
