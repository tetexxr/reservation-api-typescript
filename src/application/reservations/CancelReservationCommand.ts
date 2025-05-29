import { ReservationId } from '@/domain/reservations/ReservationId'

export class CancelReservationCommand {
  constructor(public readonly reservationId: ReservationId) {}
}
