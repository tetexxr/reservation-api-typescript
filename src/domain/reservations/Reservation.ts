import { CustomerDetails } from './CustomerDetails'
import { ReservationId } from './ReservationId'

export class Reservation {
  public static readonly RESERVATION_DURATION_MINUTES = 45

  constructor(
    public readonly id: ReservationId,
    public readonly time: Date,
    public readonly customerDetails: CustomerDetails,
    public readonly partySize: number
  ) {}

  getEndTime(): Date {
    return new Date(this.time.getTime() + Reservation.RESERVATION_DURATION_MINUTES * 60_000)
  }

  isOverlappingWith(otherTime: Date): boolean {
    const otherEndTime = new Date(otherTime.getTime() + Reservation.RESERVATION_DURATION_MINUTES * 60_000)
    return (
      (otherTime >= this.time && otherTime < this.getEndTime()) ||
      (otherEndTime > this.time && otherEndTime <= this.getEndTime())
    )
  }

  static create(time: Date, customerDetails: CustomerDetails, partySize: number): Reservation {
    return new Reservation(ReservationId.new(), time, customerDetails, partySize)
  }
}
