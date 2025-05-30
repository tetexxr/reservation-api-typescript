import 'reflect-metadata'
import { describe, it, expect } from 'vitest'
import { buildApp } from '@/app'

describe('Reservations API', () => {
  it('should return 200 when getting reservations', async () => {
    const app = buildApp()

    const response = await app.inject({
      method: 'GET',
      url: '/v1/reservations'
    })

    expect(response.statusCode).toBe(200)
  })
})
