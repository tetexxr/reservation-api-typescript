import 'reflect-metadata'
import { describe, it, expect, beforeEach } from 'vitest'
import { container } from 'tsyringe'
import { cleaner } from '../helpers/cleaner'
import { ReservationTableRepository } from '@/domain/reservations/ReservationTableRepository'
import { ReservationId } from '@/domain/reservations/ReservationId'
import { TableNumber } from '@/domain/tables/TableNumber'

describe('ReservationTableRepository', () => {
  const repository = container.resolve<ReservationTableRepository>('ReservationTableRepository')

  beforeEach(async () => {
    await cleaner()
  })

  it('should add a reservation table', async () => {
    const reservationId = ReservationId.new()
    const tableNumber = new TableNumber(1)

    await repository.add(reservationId, tableNumber)

    const found = await repository.findById(reservationId)
    expect(found).toEqual(tableNumber)
  })

  it('should remove a reservation table', async () => {
    const reservationId = ReservationId.new()
    const tableNumber = new TableNumber(1)
    await repository.add(reservationId, tableNumber)

    await repository.remove(reservationId)

    const found = await repository.findById(reservationId)
    expect(found).toBeNull()
  })

  it('should retrieve all reservation tables', async () => {
    const reservationId1 = ReservationId.new()
    const reservationId2 = ReservationId.new()
    const tableNumber1 = new TableNumber(1)
    const tableNumber2 = new TableNumber(2)
    await repository.add(reservationId1, tableNumber1)
    await repository.add(reservationId2, tableNumber2)

    const reservationTables = await repository.findAll()

    expect(reservationTables.size).toBe(2)
    expect(reservationTables).toEqual(
      new Map([
        [reservationId1, tableNumber1],
        [reservationId2, tableNumber2]
      ])
    )
  })

  it('should find a reservation table by reservation id', async () => {
    const reservationId = ReservationId.new()
    const tableNumber = new TableNumber(1)
    await repository.add(reservationId, tableNumber)

    const found = await repository.findById(reservationId)
    expect(found).toEqual(tableNumber)
  })
})
