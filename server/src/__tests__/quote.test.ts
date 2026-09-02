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

  it('returns only that author\'s quotes for GET /quote?author=Batman', async () => {
    const response = await request(app)
      .get('/quote')
      .query({ author: 'Batman' })
      .set('Authorization', 'Bearer demo-token')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        text: expect.any(String),
        author: 'Batman',
        timestamp: expect.any(String),
      }),
    )
  })

  it('matches the author case-insensitively', async () => {
    const response = await request(app)
      .get('/quote')
      .query({ author: 'batman' })
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
    expect(response.body).toEqual({ error: "No quotes found for author 'Nobody'" })
  })

  it('still returns a random quote when author is empty', async () => {
    const response = await request(app)
      .get('/quote')
      .query({ author: '' })
      .set('Authorization', 'Bearer demo-token')

    expect(response.status).toBe(200)
    expect(response.body.author).toEqual(expect.any(String))
  })

  it('returns the distinct sorted authors from GET /authors', async () => {
    const response = await request(app)
      .get('/authors')
      .set('Authorization', 'Bearer demo-token')

    expect(response.status).toBe(200)
    expect(response.body.authors).toContain('Batman')
    expect(response.body.authors).toEqual([...response.body.authors].sort((a: string, b: string) => a.localeCompare(b)))
    expect(new Set(response.body.authors).size).toBe(response.body.authors.length)
  })

  it('returns 401 when GET /authors has no authorization header', async () => {
    const response = await request(app).get('/authors')

    expect(response.status).toBe(401)
  })

  it('returns an ok status from GET /health', async () => {
    const response = await request(app).get('/health')

    expect(response.body).toEqual({ status: 'ok' })
  })
})