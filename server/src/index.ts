import express from 'express'
import cors from 'cors'
import type { Request, Response } from 'express'

import { generateRandomQuote } from './services/quoteGenerator'

const app = express()
const PORT = process.env.PORT ?? 3001
const API_TOKEN = process.env.API_TOKEN || 'Bearer secret-quote-token-12345'
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
