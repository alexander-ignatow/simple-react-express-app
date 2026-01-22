import express from 'express'
import type { Request, Response } from 'express'

const app = express()
const PORT = process.env.PORT ?? 3001

// Middleware
app.use(express.json())

// Routes
app.get('/quote', (_req: Request, res: Response): void => {
  // Stub implementation - returns a placeholder quote
  const quote = {
    text: 'This is a stub quote endpoint',
    author: 'System',
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
