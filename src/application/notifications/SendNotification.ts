import { injectable, inject } from 'tsyringe'
import { NotificationRepository } from '@/domain/notifications/NotificationRepository'
import { ReservationRepository } from '@/domain/reservations/ReservationRepository'
import { ReservationTableRepository } from '@/domain/reservations/ReservationTableRepository'

@injectable()
export class SendNotification {
  constructor(
    @inject('ReservationRepository') private readonly reservationRepository: ReservationRepository,
    @inject('ReservationTableRepository') private readonly reservationTableRepository: ReservationTableRepository,
    @inject('NotificationRepository') private readonly notificationRepository: NotificationRepository
  ) {}

  async execute(): Promise<void> {
    const now = new Date()
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)
    oneHourLater.setMinutes(0, 0, 0)

    const allReservations = await this.reservationRepository.findAll()
    const reservations = allReservations.filter((reservation) => {
      const reservationTime = new Date(reservation.time)
      reservationTime.setMinutes(0, 0, 0)
      return reservationTime.getTime() === oneHourLater.getTime()
    })

    for (const reservation of reservations) {
      const tableNumber = await this.reservationTableRepository.findById(reservation.id)
      if (tableNumber !== null) {
        await this.notificationRepository.notify(reservation)
      }
    }
  }
}
