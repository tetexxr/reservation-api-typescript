import { Reservation } from '../reservations/Reservation'

export interface NotificationRepository {
  notify(reservation: Reservation): Promise<void>
}
