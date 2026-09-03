import express from 'express'
import cors from 'cors'
import type { Request, Response } from 'express'

import { generateQuoteByAuthor, generateRandomQuote } from './services/quoteGenerator'

const app = express()
const PORT = Number(process.env.PORT ?? 3001)
const API_TOKEN = process.env.API_TOKEN || 'demo-token'
const NODE_ENV = process.env.NODE_ENV || 'development'

// CORS configuration
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      callback(null, true)
      return
    }

    // Development: allow all localhost origins
    if (NODE_ENV === 'development' && origin.startsWith('http://localhost')) {
      callback(null, true)
      return
    }

    // Production: check against CLIENT_URL
    const clientUrl = process.env.CLIENT_URL
    if (NODE_ENV === 'production' && clientUrl && origin === clientUrl) {
      callback(null, true)
      return
    }

    // Deny by default
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json())

// Request logging middleware
app.use((req: Request, _: Response, next: () => void): void => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${req.method} ${req.path}`)
  next()
})

// Authentication middleware
const authenticateToken = (req: Request, res: Response, next: () => void): void => {
  const authHeader = req.headers.authorization
  const timestamp = new Date().toISOString()

  if (!authHeader || authHeader !== `Bearer ${API_TOKEN}`) {
    console.log(`[${timestamp}] AUTH FAILED - ${req.method} ${req.path}`)
    res.status(401).json({ error: 'Unauthorized: Invalid or missing authentication token' })
    return
  }

  console.log(`[${timestamp}] AUTH SUCCESS - ${req.method} ${req.path}`)
  next()
}

// Routes
app.get('/quote', authenticateToken, (req: Request, res: Response): void => {
  const timestamp = new Date().toISOString()
  const { author } = req.query

  // An `author` query narrows the pool to that author. Anything else (absent, blank, or
  // repeated so Express parses it as an array) keeps the original random behaviour.
  if (typeof author === 'string' && author.trim().length > 0) {
    const authoredQuote = generateQuoteByAuthor(author)

    if (!authoredQuote) {
      res.status(404).json({ error: `No quotes found for author: ${author}` })
      return
    }

    res.json({ ...authoredQuote, timestamp })
    return
  }

  res.json({ ...generateRandomQuote(), timestamp })
})

// Health check endpoint
app.get('/health', (_req: Request, res: Response): void => {
  res.json({ status: 'ok' })
})

export default app

if (require.main === module) {
  app.listen(PORT, (): void => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
}
