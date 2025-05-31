import 'reflect-metadata'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetFreeTables } from '@/application/availability/GetFreeTables'
import { GetFreeTablesQuery } from '@/application/availability/GetFreeTablesQuery'
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

describe('GetFreeTables', () => {
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

  it('should return all suitable tables when there are no reservations', async () => {
    const tables = [
      new Table(new TableNumber(1), 2),
      new Table(new TableNumber(2), 4),
      new Table(new TableNumber(3), 4),
      new Table(new TableNumber(4), 6)
    ]
    tableRepository.findAll.mockResolvedValue(tables)

    const getFreeTables = new GetFreeTables(tableRepository, reservationRepository, reservationTableRepository)

    const query = new GetFreeTablesQuery(new Date('2021-10-10T10:00:00'), 4)
    const result = await getFreeTables.execute(query)

    expect(result).toEqual([new Table(new TableNumber(2), 4), new Table(new TableNumber(3), 4)])
    expect(tableRepository.findAll).toHaveBeenCalledTimes(1)
    expect(reservationRepository.findAll).toHaveBeenCalledTimes(1)
    expect(reservationTableRepository.findAll).toHaveBeenCalledTimes(1)
  })

  it('should return only suitable tables for the party size', async () => {
    const tables = [new Table(new TableNumber(1), 4), new Table(new TableNumber(2), 6)]
    tableRepository.findAll.mockResolvedValue(tables)

    const getFreeTables = new GetFreeTables(tableRepository, reservationRepository, reservationTableRepository)

    const query = new GetFreeTablesQuery(new Date('2021-10-10T10:00:00'), 3)
    const result = await getFreeTables.execute(query)

    expect(result).toEqual([new Table(new TableNumber(1), 4)])
    expect(tableRepository.findAll).toHaveBeenCalledTimes(1)
    expect(reservationRepository.findAll).toHaveBeenCalledTimes(1)
    expect(reservationTableRepository.findAll).toHaveBeenCalledTimes(1)
  })

  it('should exclude reserved tables', async () => {
    const tables = [new Table(new TableNumber(1), 4), new Table(new TableNumber(2), 6)]
    const reservation = Reservation.create(
      new Date('2021-10-10T10:00:00'),
      new CustomerDetails('John', 'john@test.com', '931111111'),
      4
    )
    const reservedTables = new Map([[reservation.id, new TableNumber(1)]])
    tableRepository.findAll.mockResolvedValue(tables)
    reservationRepository.findAll.mockResolvedValue([reservation])
    reservationTableRepository.findAll.mockResolvedValue(reservedTables)

    const getFreeTables = new GetFreeTables(tableRepository, reservationRepository, reservationTableRepository)

    const query = new GetFreeTablesQuery(new Date('2021-10-10T10:00:00'), 4)
    const result = await getFreeTables.execute(query)

    expect(result).toEqual([])
    expect(tableRepository.findAll).toHaveBeenCalledTimes(1)
    expect(reservationRepository.findAll).toHaveBeenCalledTimes(1)
    expect(reservationTableRepository.findAll).toHaveBeenCalledTimes(1)
  })

  it('should return available tables when there are reservations', async () => {
    const tables = [new Table(new TableNumber(1), 4), new Table(new TableNumber(2), 4)]
    const reservation = Reservation.create(
      new Date('2021-10-10T10:00:00'),
      new CustomerDetails('John', 'john@test.com', '931111111'),
      4
    )
    const reservedTables = new Map([[reservation.id, new TableNumber(1)]])
    tableRepository.findAll.mockResolvedValue(tables)
    reservationRepository.findAll.mockResolvedValue([reservation])
    reservationTableRepository.findAll.mockResolvedValue(reservedTables)

    const getFreeTables = new GetFreeTables(tableRepository, reservationRepository, reservationTableRepository)

    const query = new GetFreeTablesQuery(new Date('2021-10-10T10:05:00'), 4)
    const result = await getFreeTables.execute(query)

    expect(result).toEqual([new Table(new TableNumber(2), 4)])
    expect(tableRepository.findAll).toHaveBeenCalledTimes(1)
    expect(reservationRepository.findAll).toHaveBeenCalledTimes(1)
    expect(reservationTableRepository.findAll).toHaveBeenCalledTimes(1)
  })

  it('should return empty list when no tables are suitable', async () => {
    const tables = [new Table(new TableNumber(1), 4), new Table(new TableNumber(2), 6)]
    tableRepository.findAll.mockResolvedValue(tables)

    const getFreeTables = new GetFreeTables(tableRepository, reservationRepository, reservationTableRepository)

    const query = new GetFreeTablesQuery(new Date('2021-10-10T10:00:00'), 8)
    const result = await getFreeTables.execute(query)

    expect(result).toEqual([])
    expect(tableRepository.findAll).toHaveBeenCalledTimes(1)
    expect(reservationRepository.findAll).toHaveBeenCalledTimes(1)
    expect(reservationTableRepository.findAll).toHaveBeenCalledTimes(1)
  })
})
