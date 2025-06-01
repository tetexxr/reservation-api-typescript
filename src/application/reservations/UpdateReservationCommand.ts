import { Reservation } from '@/domain/reservations/Reservation'

export type UpdateReservationCommand = {
  reservation: Reservation
}
