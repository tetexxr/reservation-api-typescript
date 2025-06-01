import { Reservation } from '@/domain/reservations/Reservation'

export type CreateReservationCommand = {
  reservation: Reservation
}
