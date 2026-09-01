import request from 'supertest'
import { describe, expect, it } from 'vitest'

import app from '../index'

describe('quote endpoints', () => {
  it('returns 401 when GET /quote has no authorization header', async () => {
    const response = await request(app).get('/quote')

    expect(response.status).toBe(401)
  })

  it('returns a quote when GET /quote uses the demo token', async () => {
    const response = await request(app)
      .get('/quote')
      .set('Authorization', 'Bearer demo-token')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        text: expect.any(String),
        author: expect.any(String),
        timestamp: expect.any(String),
      }),
    )
  })

  it('returns an ok status from GET /health', async () => {
    const response = await request(app).get('/health')

    expect(response.body).toEqual({ status: 'ok' })
  })
})