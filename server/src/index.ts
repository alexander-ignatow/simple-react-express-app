import express from 'express'
import type { Request, Response } from 'express'

import { generateRandomQuote } from './services/quoteGenerator'

const app = express()
const PORT = process.env.PORT ?? 3001
const API_TOKEN = 'Bearer secret-quote-token-12345'

// Middleware
app.use(express.json())

// Authentication middleware
const authenticateToken = (req: Request, res: Response, next: () => void): void => {
  const authHeader = req.headers.authorization
  if (!authHeader || authHeader !== API_TOKEN) {
    res.status(401).json({ error: 'Unauthorized: Invalid or missing authentication token' })
    return
  }
  next()
}

// Routes
app.get('/quote', authenticateToken, (_req: Request, res: Response): void => {
  const quote = {
    ...generateRandomQuote(),
    timestamp: new Date().toISOString(),
  }

  res.json(quote)
})

// Health check endpoint
app.get('/health', (_req: Request, res: Response): void => {
  res.json({ status: 'ok' })
})

// Start server
app.listen(PORT, (): void => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

export default app
