import { Reservation } from '@/domain/reservations/Reservation'

export class UpdateReservationCommand {
  constructor(public readonly reservation: Reservation) {}
}
