import 'reflect-metadata'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SendNotification } from '@/application/notifications/SendNotification'
import { Reservation } from '@/domain/reservations/Reservation'
import { CustomerDetails } from '@/domain/reservations/CustomerDetails'
import { ReservationRepository } from '@/domain/reservations/ReservationRepository'
import { ReservationTableRepository } from '@/domain/reservations/ReservationTableRepository'
import { NotificationRepository } from '@/domain/notifications/NotificationRepository'
import { TableNumber } from '@/domain/tables/TableNumber'

vi.mock('@/domain/reservations/ReservationRepository')
vi.mock('@/domain/reservations/ReservationTableRepository')
vi.mock('@/domain/notifications/NotificationRepository')

describe('SendNotification', () => {
  const reservationRepository = vi.mocked<ReservationRepository>({
    findAll: vi.fn(),
    insert: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  })
  const reservationTableRepository = vi.mocked<ReservationTableRepository>({
    findById: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
    findAll: vi.fn()
  })
  const notificationRepository = vi.mocked<NotificationRepository>({
    notify: vi.fn()
  })

  beforeEach(() => {
    vi.resetAllMocks()
    reservationRepository.findAll.mockResolvedValue([])
    reservationTableRepository.findById.mockResolvedValue(null)
  })

  it('should send notification for reservations happening in one hour', async () => {
    const now = new Date()
    const reservations = [
      Reservation.create(
        new Date(now.getTime() + 60 * 60 * 1000),
        new CustomerDetails('John', 'john@test.com', '931111111'),
        4
      ),
      Reservation.create(
        new Date(now.getTime() + 60 * 60 * 1000 + 60 * 1000),
        new CustomerDetails('Jane', 'jane@test.com', '932222222'),
        2
      )
    ]
    reservationRepository.findAll.mockResolvedValue(reservations)
    reservationTableRepository.findById.mockImplementation((id) => {
      if (id.value === reservations[0].id.value) {
        return Promise.resolve(new TableNumber(1))
      }
      return Promise.resolve(null)
    })

    const sendNotification = new SendNotification(
      reservationRepository,
      reservationTableRepository,
      notificationRepository
    )

    await sendNotification.execute()

    expect(notificationRepository.notify).toHaveBeenCalledWith(reservations[0])
    expect(notificationRepository.notify).toHaveBeenCalledTimes(1)
  })

  it('should not send notification for reservations not happening in one hour', async () => {
    const now = new Date()
    const reservations = [
      Reservation.create(
        new Date(now.getTime() + 60 * 60 * 1000 + 60 * 1000),
        new CustomerDetails('John', 'john@test.com', '931111111'),
        4
      )
    ]
    reservationRepository.findAll.mockResolvedValue(reservations)

    const sendNotification = new SendNotification(
      reservationRepository,
      reservationTableRepository,
      notificationRepository
    )

    await sendNotification.execute()

    expect(notificationRepository.notify).not.toHaveBeenCalled()
  })

  it('should not send notification if the reservation do not have a table assigned', async () => {
    const now = new Date()
    const reservations = [
      Reservation.create(
        new Date(now.getTime() + 60 * 60 * 1000),
        new CustomerDetails('John', 'john@test.com', '931111111'),
        4
      )
    ]
    reservationRepository.findAll.mockResolvedValue(reservations)
    reservationTableRepository.findById.mockResolvedValue(null)

    const sendNotification = new SendNotification(
      reservationRepository,
      reservationTableRepository,
      notificationRepository
    )

    await sendNotification.execute()

    expect(notificationRepository.notify).not.toHaveBeenCalled()
  })

  it('should send notifications for multiple reservations happening in one hour', async () => {
    const now = new Date()
    const reservations = [
      Reservation.create(
        new Date(now.getTime() + 60 * 60 * 1000),
        new CustomerDetails('John', 'john@test.com', '931111111'),
        4
      ),
      Reservation.create(
        new Date(now.getTime() + 60 * 60 * 1000),
        new CustomerDetails('Jane', 'jane@test.com', '932222222'),
        2
      ),
      Reservation.create(
        new Date(now.getTime() + 60 * 60 * 1000 - 60 * 1000),
        new CustomerDetails('Alice', 'alice@test.com', '933333333'),
        6
      )
    ]
    reservationRepository.findAll.mockResolvedValue(reservations)
    reservationTableRepository.findById.mockImplementation((id) => {
      if (id.value === reservations[0].id.value) {
        return Promise.resolve(new TableNumber(1))
      }
      if (id.value === reservations[1].id.value) {
        return Promise.resolve(new TableNumber(2))
      }
      return Promise.resolve(null)
    })

    const sendNotification = new SendNotification(
      reservationRepository,
      reservationTableRepository,
      notificationRepository
    )

    await sendNotification.execute()

    expect(notificationRepository.notify).toHaveBeenCalledWith(reservations[0])
    expect(notificationRepository.notify).toHaveBeenCalledWith(reservations[1])
    expect(notificationRepository.notify).toHaveBeenCalledTimes(2)
  })
})
