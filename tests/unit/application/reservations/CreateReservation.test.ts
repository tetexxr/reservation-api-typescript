import 'reflect-metadata'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CreateReservation } from '@/application/reservations/CreateReservation'
import { CreateReservationCommand } from '@/application/reservations/CreateReservationCommand'
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

describe('CreateReservation', () => {
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

  it('should create a reservation and assign to a table', async () => {
    const reservation = Reservation.create(
      new Date('2021-10-10T10:00:00'),
      new CustomerDetails('John', 'john@test.com', '931111111'),
      4
    )
    const getFreeTables = {
      execute: vi.fn().mockResolvedValue([new Table(new TableNumber(1), 4)])
    } as unknown as GetFreeTables
    reservationRepository.insert.mockResolvedValue(reservation)

    const createReservation = new CreateReservation(
      getFreeTables,
      reservationRepository,
      reservationTableRepository,
      waitListRepository
    )
    const command = new CreateReservationCommand(reservation)

    const id = await createReservation.execute(command)

    expect(reservationRepository.insert).toHaveBeenCalledWith(reservation)
    expect(reservationTableRepository.add).toHaveBeenCalledWith(reservation.id, new TableNumber(1))
    expect(waitListRepository.add).not.toHaveBeenCalled()
    expect(id.value).toBeTruthy()
  })

  it('should add reservation to waitlist when there are no free tables', async () => {
    const reservation = Reservation.create(
      new Date('2021-10-10T10:00:00'),
      new CustomerDetails('John', 'john@test.com', '931111111'),
      4
    )
    const getFreeTables = {
      execute: vi.fn().mockResolvedValue([])
    } as unknown as GetFreeTables
    reservationRepository.insert.mockResolvedValue(reservation)

    const createReservation = new CreateReservation(
      getFreeTables,
      reservationRepository,
      reservationTableRepository,
      waitListRepository
    )
    const command = new CreateReservationCommand(reservation)

    const id = await createReservation.execute(command)

    expect(reservationRepository.insert).toHaveBeenCalledWith(reservation)
    expect(reservationTableRepository.add).not.toHaveBeenCalled()
    expect(waitListRepository.add).toHaveBeenCalledWith(reservation.id)
    expect(id.value).toBeTruthy()
  })
})
