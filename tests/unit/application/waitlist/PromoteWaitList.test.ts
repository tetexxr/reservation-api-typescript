import 'reflect-metadata'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PromoteWaitList } from '@/application/waitlist/PromoteWaitList'
import { PromoteWaitListCommand } from '@/application/waitlist/PromoteWaitListCommand'
import { GetFreeTables } from '@/application/availability/GetFreeTables'
import { Reservation } from '@/domain/reservations/Reservation'
import { CustomerDetails } from '@/domain/reservations/CustomerDetails'
import { Table } from '@/domain/tables/Table'
import { TableNumber } from '@/domain/tables/TableNumber'
import { ReservationRepository } from '@/domain/reservations/ReservationRepository'
import { ReservationTableRepository } from '@/domain/reservations/ReservationTableRepository'
import { WaitListRepository } from '@/domain/waitlist/WaitListRepository'

vi.mock('@/application/availability/GetFreeTables')
vi.mock('@/domain/reservations/ReservationRepository')
vi.mock('@/domain/reservations/ReservationTableRepository')
vi.mock('@/domain/waitlist/WaitListRepository')

describe('PromoteWaitList', () => {
  const reservationRepository = vi.mocked<ReservationRepository>({
    insert: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  })
  const reservationTableRepository = vi.mocked<ReservationTableRepository>({
    add: vi.fn(),
    remove: vi.fn(),
    findById: vi.fn(),
    findAll: vi.fn()
  })
  const waitListRepository = vi.mocked<WaitListRepository>({
    add: vi.fn(),
    remove: vi.fn(),
    findAll: vi.fn()
  })

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should promote reservations within the given time range and seating capacity', async () => {
    const getFreeTables = {
      execute: vi.fn().mockResolvedValue([new Table(new TableNumber(1), 4)])
    } as unknown as GetFreeTables
    const promoteWaitList = new PromoteWaitList(
      getFreeTables,
      reservationRepository,
      reservationTableRepository,
      waitListRepository
    )
    const command = new PromoteWaitListCommand(new Date('2021-10-10T10:00:00'), new Date('2021-10-10T12:00:00'), 4)
    const reservation = Reservation.create(
      new Date('2021-10-10T10:30:00'),
      new CustomerDetails('John', 'john@test.com', '931111111'),
      4
    )
    waitListRepository.findAll.mockResolvedValue(new Set([reservation.id]))
    reservationRepository.findAll.mockResolvedValue([reservation])

    await promoteWaitList.execute(command)

    expect(reservationTableRepository.add).toHaveBeenCalledWith(reservation.id, new TableNumber(1))
    expect(waitListRepository.remove).toHaveBeenCalledWith(reservation.id)
  })

  it('should not promote reservations outside the given time range', async () => {
    const getFreeTables = {
      execute: vi.fn()
    } as unknown as GetFreeTables
    const promoteWaitList = new PromoteWaitList(
      getFreeTables,
      reservationRepository,
      reservationTableRepository,
      waitListRepository
    )
    const command = new PromoteWaitListCommand(new Date('2021-10-10T10:00:00'), new Date('2021-10-10T12:00:00'), 4)
    const reservation = Reservation.create(
      new Date('2021-10-10T12:30:00'),
      new CustomerDetails('John', 'john@test.com', '931111111'),
      4
    )
    waitListRepository.findAll.mockResolvedValue(new Set([reservation.id]))
    reservationRepository.findAll.mockResolvedValue([reservation])

    await promoteWaitList.execute(command)

    expect(reservationTableRepository.add).not.toHaveBeenCalled()
    expect(waitListRepository.remove).not.toHaveBeenCalled()
    expect(getFreeTables.execute).not.toHaveBeenCalled()
  })

  it('should not promote reservations exceeding the seating capacity', async () => {
    const getFreeTables = {
      execute: vi.fn()
    } as unknown as GetFreeTables
    const promoteWaitList = new PromoteWaitList(
      getFreeTables,
      reservationRepository,
      reservationTableRepository,
      waitListRepository
    )
    const command = new PromoteWaitListCommand(new Date('2021-10-10T10:00:00'), new Date('2021-10-10T12:00:00'), 4)
    const reservation = Reservation.create(
      new Date('2021-10-10T10:30:00'),
      new CustomerDetails('John', 'john@test.com', '931111111'),
      5
    )
    waitListRepository.findAll.mockResolvedValue(new Set())
    reservationRepository.findAll.mockResolvedValue([reservation])

    await promoteWaitList.execute(command)

    expect(reservationTableRepository.add).not.toHaveBeenCalled()
    expect(waitListRepository.remove).not.toHaveBeenCalled()
  })

  it('should not promote reservations when no free tables are available', async () => {
    const getFreeTables = {
      execute: vi.fn().mockResolvedValue([])
    } as unknown as GetFreeTables
    const promoteWaitList = new PromoteWaitList(
      getFreeTables,
      reservationRepository,
      reservationTableRepository,
      waitListRepository
    )
    const command = new PromoteWaitListCommand(new Date('2021-10-10T10:00:00'), new Date('2021-10-10T12:00:00'), 4)
    const reservation = Reservation.create(
      new Date('2021-10-10T10:30:00'),
      new CustomerDetails('John', 'john@test.com', '931111111'),
      4
    )
    waitListRepository.findAll.mockResolvedValue(new Set([reservation.id]))
    reservationRepository.findAll.mockResolvedValue([reservation])

    await promoteWaitList.execute(command)

    expect(reservationTableRepository.add).not.toHaveBeenCalled()
    expect(waitListRepository.remove).not.toHaveBeenCalled()
  })

  it('should not promote reservations when the waitlist is empty', async () => {
    const getFreeTables = {
      execute: vi.fn()
    } as unknown as GetFreeTables
    const promoteWaitList = new PromoteWaitList(
      getFreeTables,
      reservationRepository,
      reservationTableRepository,
      waitListRepository
    )
    const command = new PromoteWaitListCommand(new Date('2021-10-10T10:00:00'), new Date('2021-10-10T12:00:00'), 4)
    waitListRepository.findAll.mockResolvedValue(new Set())

    await promoteWaitList.execute(command)

    expect(reservationRepository.findAll).not.toHaveBeenCalled()
    expect(getFreeTables.execute).not.toHaveBeenCalled()
  })
})
