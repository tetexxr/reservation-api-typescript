import 'reflect-metadata'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UpdateReservation } from '@/application/reservations/UpdateReservation'
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

describe('UpdateReservation', () => {
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

  it('should update a reservation and reassign to a table', async () => {
    const reservation = Reservation.create(new Date(), new CustomerDetails('John', 'john@test.com', '931111111'), 4)
    const getFreeTables = {
      execute: vi.fn().mockResolvedValue([new Table(new TableNumber(1), 4)])
    } as unknown as GetFreeTables
    const updateReservation = new UpdateReservation(
      getFreeTables,
      reservationRepository,
      reservationTableRepository,
      waitListRepository
    )

    await updateReservation.execute({
      reservation
    })

    expect(reservationTableRepository.remove).toHaveBeenCalledWith(reservation.id)
    expect(waitListRepository.remove).toHaveBeenCalledWith(reservation.id)
    expect(reservationRepository.update).toHaveBeenCalledWith(reservation)
    expect(reservationTableRepository.add).toHaveBeenCalledWith(reservation.id, new TableNumber(1))
    expect(waitListRepository.add).not.toHaveBeenCalled()
  })

  it('should add reservation to waitlist when there are no free tables', async () => {
    const reservation = Reservation.create(new Date(), new CustomerDetails('John', 'john@test.com', '931111111'), 4)
    const getFreeTables = {
      execute: vi.fn().mockResolvedValue([])
    } as unknown as GetFreeTables
    const updateReservation = new UpdateReservation(
      getFreeTables,
      reservationRepository,
      reservationTableRepository,
      waitListRepository
    )

    await updateReservation.execute({
      reservation
    })

    expect(reservationTableRepository.remove).toHaveBeenCalledWith(reservation.id)
    expect(waitListRepository.remove).toHaveBeenCalledWith(reservation.id)
    expect(reservationRepository.update).toHaveBeenCalledWith(reservation)
    expect(reservationTableRepository.add).not.toHaveBeenCalled()
    expect(waitListRepository.add).toHaveBeenCalledWith(reservation.id)
  })
})
