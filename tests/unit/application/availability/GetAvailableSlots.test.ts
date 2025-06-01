import 'reflect-metadata'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GetAvailableSlots } from '@/application/availability/GetAvailableSlots'
import { AvailableSlot } from '@/domain/availability/AvailableSlot'
import { Table } from '@/domain/tables/Table'
import { TableNumber } from '@/domain/tables/TableNumber'
import { Reservation } from '@/domain/reservations/Reservation'
import { CustomerDetails } from '@/domain/reservations/CustomerDetails'
import { TableRepository } from '@/domain/tables/TableRepository'
import { ReservationRepository } from '@/domain/reservations/ReservationRepository'
import { ReservationTableRepository } from '@/domain/reservations/ReservationTableRepository'

vi.mock('@/domain/tables/TableRepository')
vi.mock('@/domain/reservations/ReservationRepository')
vi.mock('@/domain/reservations/ReservationTableRepository')

describe('GetAvailableSlots', () => {
  const tableRepository = vi.mocked<TableRepository>({
    findAll: vi.fn()
  })
  const reservationRepository = vi.mocked<ReservationRepository>({
    findAll: vi.fn(),
    insert: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  })
  const reservationTableRepository = vi.mocked<ReservationTableRepository>({
    findAll: vi.fn(),
    findById: vi.fn(),
    add: vi.fn(),
    remove: vi.fn()
  })

  beforeEach(() => {
    vi.resetAllMocks()
    tableRepository.findAll.mockResolvedValue([])
    reservationRepository.findAll.mockResolvedValue([])
    reservationTableRepository.findAll.mockResolvedValue(new Map())
  })

  it('should return all slots when there are no reservations', async () => {
    const tables = [
      new Table(new TableNumber(1), 4),
      new Table(new TableNumber(2), 4),
      new Table(new TableNumber(3), 6),
      new Table(new TableNumber(4), 8)
    ]
    tableRepository.findAll.mockResolvedValue(tables)
    reservationRepository.findAll.mockResolvedValue([])
    reservationTableRepository.findAll.mockResolvedValue(new Map())

    const getAvailableSlots = new GetAvailableSlots(tableRepository, reservationRepository, reservationTableRepository)
    const availableSlots = await getAvailableSlots.execute({
      date: new Date('2021-10-10'),
      partySize: 4
    })

    // 24 slots per table (15 min slots from 8:00 to 14:00), for 2 tables with party size 4
    expect(availableSlots.length).toBe(24 * 2)
    expect(availableSlots).toEqual(
      expect.arrayContaining([
        new AvailableSlot(new Date('2021-10-10T08:00:00'), new Date('2021-10-10T08:15:00'), 4, new TableNumber(1)),
        new AvailableSlot(new Date('2021-10-10T08:00:00'), new Date('2021-10-10T08:15:00'), 4, new TableNumber(2)),
        new AvailableSlot(new Date('2021-10-10T13:45:00'), new Date('2021-10-10T14:00:00'), 4, new TableNumber(1)),
        new AvailableSlot(new Date('2021-10-10T13:45:00'), new Date('2021-10-10T14:00:00'), 4, new TableNumber(2))
      ])
    )
  })

  it('should not return slots when all day is completely reserved', async () => {
    const tables = [new Table(new TableNumber(1), 4)]
    const opening = new Date('2021-10-10T08:00:00')
    const reservations = Array.from({ length: 24 }, (_, i) =>
      reservationAt(new Date(opening.getTime() + 45 * 60_000 * i))
    )
    const reservedTables = new Map(reservations.map((r) => [r.id, new TableNumber(1)]))
    tableRepository.findAll.mockResolvedValue(tables)
    reservationRepository.findAll.mockResolvedValue(reservations)
    reservationTableRepository.findAll.mockResolvedValue(reservedTables)

    const getAvailableSlots = new GetAvailableSlots(tableRepository, reservationRepository, reservationTableRepository)
    const availableSlots = await getAvailableSlots.execute({
      date: new Date('2021-10-10'),
      partySize: 4
    })

    expect(availableSlots).toEqual([])
  })

  it('should return slots when there are some reservations', async () => {
    const tables = [new Table(new TableNumber(1), 4)]
    const opening = new Date('2021-10-10T08:00:00')
    const reservations = Array.from({ length: 24 }, (_, i) =>
      reservationAt(new Date(opening.getTime() + i * 60 * 60 * 1000))
    )
    const reservedTables = new Map(reservations.map((r) => [r.id, new TableNumber(1)]))
    tableRepository.findAll.mockResolvedValue(tables)
    reservationRepository.findAll.mockResolvedValue(reservations)
    reservationTableRepository.findAll.mockResolvedValue(reservedTables)

    const getAvailableSlots = new GetAvailableSlots(tableRepository, reservationRepository, reservationTableRepository)
    const availableSlots = await getAvailableSlots.execute({
      date: new Date('2021-10-10'),
      partySize: 4
    })

    expect(availableSlots.length).toBe(6)
    expect(availableSlots).toEqual([
      new AvailableSlot(new Date('2021-10-10T08:45:00'), new Date('2021-10-10T09:00:00'), 4, new TableNumber(1)),
      new AvailableSlot(new Date('2021-10-10T09:45:00'), new Date('2021-10-10T10:00:00'), 4, new TableNumber(1)),
      new AvailableSlot(new Date('2021-10-10T10:45:00'), new Date('2021-10-10T11:00:00'), 4, new TableNumber(1)),
      new AvailableSlot(new Date('2021-10-10T11:45:00'), new Date('2021-10-10T12:00:00'), 4, new TableNumber(1)),
      new AvailableSlot(new Date('2021-10-10T12:45:00'), new Date('2021-10-10T13:00:00'), 4, new TableNumber(1)),
      new AvailableSlot(new Date('2021-10-10T13:45:00'), new Date('2021-10-10T14:00:00'), 4, new TableNumber(1))
    ])
  })

  it('should handle reservations that do not align with 15 minute slots', async () => {
    const tables = [new Table(new TableNumber(1), 4)]
    const reservations = [
      reservationAt(new Date('2021-10-10T08:00:00')),
      reservationAt(new Date('2021-10-10T08:55:00')),
      reservationAt(new Date('2021-10-10T09:55:00')),
      reservationAt(new Date('2021-10-10T10:45:00')),
      reservationAt(new Date('2021-10-10T11:37:00')),
      reservationAt(new Date('2021-10-10T12:50:00'))
    ]
    const reservedTables = new Map(reservations.map((r) => [r.id, new TableNumber(1)]))
    tableRepository.findAll.mockResolvedValue(tables)
    reservationRepository.findAll.mockResolvedValue(reservations)
    reservationTableRepository.findAll.mockResolvedValue(reservedTables)

    const getAvailableSlots = new GetAvailableSlots(tableRepository, reservationRepository, reservationTableRepository)
    const availableSlots = await getAvailableSlots.execute({
      date: new Date('2021-10-10'),
      partySize: 4
    })

    expect(availableSlots.length).toBe(3)
    expect(availableSlots).toEqual([
      new AvailableSlot(new Date('2021-10-10T09:40:00'), new Date('2021-10-10T09:55:00'), 4, new TableNumber(1)),
      new AvailableSlot(new Date('2021-10-10T12:22:00'), new Date('2021-10-10T12:37:00'), 4, new TableNumber(1)),
      new AvailableSlot(new Date('2021-10-10T13:35:00'), new Date('2021-10-10T13:50:00'), 4, new TableNumber(1))
    ])
  })
})

function reservationAt(time: Date): Reservation {
  return Reservation.create(time, new CustomerDetails('John', 'john@test.com', '931111111'), 4)
}
