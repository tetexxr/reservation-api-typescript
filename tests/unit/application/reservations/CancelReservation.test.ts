import 'reflect-metadata'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CancelReservation } from '@/application/reservations/CancelReservation'
import { CancelReservationCommand } from '@/application/reservations/CancelReservationCommand'
import { PromoteWaitList } from '@/application/waitlist/PromoteWaitList'
import { PromoteWaitListCommand } from '@/application/waitlist/PromoteWaitListCommand'
import { Reservation } from '@/domain/reservations/Reservation'
import { CustomerDetails } from '@/domain/reservations/CustomerDetails'
import { ReservationRepository } from '@/domain/reservations/ReservationRepository'
import { ReservationTableRepository } from '@/domain/reservations/ReservationTableRepository'
import { WaitListRepository } from '@/domain/waitlist/WaitListRepository'
import { ReservationId } from '@/domain/reservations/ReservationId'

vi.mock('@/application/waitlist/PromoteWaitList')
vi.mock('@/domain/reservations/ReservationRepository')
vi.mock('@/domain/reservations/ReservationTableRepository')
vi.mock('@/domain/waitlist/WaitListRepository')

describe('CancelReservation', () => {
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
  const promoteWaitList = {
    execute: vi.fn()
  } as unknown as PromoteWaitList

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should cancel a reservation', async () => {
    const reservationId = ReservationId.new()
    const reservation = Reservation.create(
      new Date('2022-01-01T12:00:00'),
      new CustomerDetails('John', 'john@test.com', '931111111'),
      4
    )
    reservationRepository.findById.mockResolvedValue(reservation)
    waitListRepository.remove.mockResolvedValue(true)

    const cancelReservation = new CancelReservation(
      reservationRepository,
      reservationTableRepository,
      waitListRepository,
      promoteWaitList
    )
    const command = new CancelReservationCommand(reservationId)

    await cancelReservation.execute(command)

    expect(reservationRepository.delete).toHaveBeenCalledWith(reservationId)
    expect(reservationTableRepository.remove).toHaveBeenCalledWith(reservationId)
    expect(waitListRepository.remove).toHaveBeenCalledWith(reservationId)
    expect(promoteWaitList.execute).not.toHaveBeenCalled()
  })

  it('should promote reservation from waitlist when cancelling a reservation that is assigned to a table', async () => {
    const reservation = Reservation.create(
      new Date('2022-01-01T12:00:00'),
      new CustomerDetails('John', 'john@test.com', '931111111'),
      4
    )
    reservationRepository.findById.mockResolvedValue(reservation)
    waitListRepository.remove.mockResolvedValue(false)

    const cancelReservation = new CancelReservation(
      reservationRepository,
      reservationTableRepository,
      waitListRepository,
      promoteWaitList
    )
    const command = new CancelReservationCommand(reservation.id)

    await cancelReservation.execute(command)

    expect(promoteWaitList.execute).toHaveBeenCalledWith(PromoteWaitListCommand.create(reservation))
  })
})
