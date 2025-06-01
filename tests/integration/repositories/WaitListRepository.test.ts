import 'reflect-metadata'
import { beforeEach, describe, expect, it } from 'vitest'
import { container } from 'tsyringe'
import { Cleaner } from '../helpers/Cleaner'
import { WaitListRepository } from '@/domain/waitlist/WaitListRepository'
import { ReservationId } from '@/domain/reservations/ReservationId'

describe('WaitListRepository', () => {
  const repository = container.resolve<WaitListRepository>('WaitListRepository')
  const cleaner = container.resolve(Cleaner)

  beforeEach(async () => {
    await cleaner.execute({ waitList: true })
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
