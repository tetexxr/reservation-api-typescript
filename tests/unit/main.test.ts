import 'reflect-metadata'
import { describe, it, expect } from 'vitest'
import { app } from '@/server'

describe('App', () => {
  it('should be defined', () => {
    expect(app).toBeDefined()
  })
})
