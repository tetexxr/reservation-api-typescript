import { Reservation } from '@/domain/reservations/Reservation'

export class CreateReservationCommand {
  constructor(public readonly reservation: Reservation) {}
}
