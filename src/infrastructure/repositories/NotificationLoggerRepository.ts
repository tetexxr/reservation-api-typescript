import { NotificationRepository } from '@/domain/notifications/NotificationRepository'
import { Reservation } from '@/domain/reservations/Reservation'

export class NotificationLoggerRepository implements NotificationRepository {
  async notify(reservation: Reservation): Promise<void> {
    console.log(`Hi ${reservation.customerDetails.name}, your reservation is confirmed at ${reservation.time}.`)
  }
}
