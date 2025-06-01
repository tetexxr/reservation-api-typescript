import { ReservationId } from '@/domain/reservations/ReservationId'

export type CancelReservationCommand = {
  reservationId: ReservationId
}
