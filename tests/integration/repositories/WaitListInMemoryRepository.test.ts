import 'reflect-metadata'
import { describe, it, expect, beforeEach } from 'vitest'
import { container } from 'tsyringe'
import { WaitListInMemoryRepository } from '@/infrastructure/repositories/WaitListInMemoryRepository'
import { Cleaner } from '../helpers/Cleaner'
import { ReservationId } from '@/domain/reservations/ReservationId'

describe('WaitListInMemoryRepository', () => {
  const repository = container.resolve<WaitListInMemoryRepository>('WaitListRepository')
  const cleaner = container.resolve(Cleaner)

  beforeEach(async () => {
    await cleaner.execute()
  })

  it('should add a reservation to the waitlist', async () => {
    const reservationId = ReservationId.new()

    await repository.add(reservationId)

    const waitList = await repository.findAll()
    expect(waitList).toEqual(new Set([reservationId]))
  })

  it('should remove a reservation from the waitlist', async () => {
    const reservationId = ReservationId.new()
    await repository.add(reservationId)

    const isRemoved = await repository.remove(reservationId)

    const waitList = await repository.findAll()
    expect(waitList.size).toBe(0)
    expect(isRemoved).toBe(true)
  })

  it('should retrieve all reservations from the waitlist', async () => {
    const reservationId1 = ReservationId.new()
    const reservationId2 = ReservationId.new()
    await repository.add(reservationId1)
    await repository.add(reservationId2)

    const waitList = await repository.findAll()

    expect(waitList.size).toBe(2)
    expect(waitList).toEqual(new Set([reservationId1, reservationId2]))
  })
})
