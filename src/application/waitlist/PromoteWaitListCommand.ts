import { Reservation } from '@/domain/reservations/Reservation'

export class PromoteWaitListCommand {
  constructor(
    public readonly from: Date,
    public readonly to: Date,
    public readonly maximumSeatingCapacity: number
  ) {}

  static create(reservation: Reservation): PromoteWaitListCommand {
    return new PromoteWaitListCommand(
      new Date(reservation.time.getTime() - Reservation.RESERVATION_DURATION_MINUTES * 60_000),
      new Date(reservation.getEndTime().getTime() + Reservation.RESERVATION_DURATION_MINUTES * 60_000),
      reservation.partySize
    )
  }
}
