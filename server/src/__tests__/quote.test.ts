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

  it('returns only quotes by the requested author for GET /quote?author=Batman', async () => {
    const response = await request(app)
      .get('/quote')
      .query({ author: 'Batman' })
      .set('Authorization', 'Bearer demo-token')

    expect(response.status).toBe(200)
    expect(response.body.author).toBe('Batman')
  })

  it('returns 404 with a JSON error body for an unknown author', async () => {
    const response = await request(app)
      .get('/quote')
      .query({ author: 'Nobody' })
      .set('Authorization', 'Bearer demo-token')

    expect(response.status).toBe(404)
    expect(response.body).toEqual({ error: 'No quotes found for author: Nobody' })
  })

  it('falls back to a random quote when the author query is blank', async () => {
    const response = await request(app)
      .get('/quote')
      .query({ author: '' })
      .set('Authorization', 'Bearer demo-token')

    expect(response.status).toBe(200)
    expect(response.body.author).toEqual(expect.any(String))
  })

  it('returns an ok status from GET /health', async () => {
    const response = await request(app).get('/health')

    expect(response.body).toEqual({ status: 'ok' })
  })
})