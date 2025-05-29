import { CustomerDetails } from './CustomerDetails'
import { ReservationId } from './ReservationId'

export class Reservation {
  private static readonly RESERVATION_DURATION_MINUTES = 45

  constructor(
    private readonly id: ReservationId,
    private readonly time: Date,
    private readonly customerDetails: CustomerDetails,
    private readonly partySize: number
  ) {}

  getId(): ReservationId {
    return this.id
  }

  getTime(): Date {
    return this.time
  }

  getCustomerDetails(): CustomerDetails {
    return this.customerDetails
  }

  getPartySize(): number {
    return this.partySize
  }

  getEndTime(): Date {
    return new Date(this.time.getTime() + Reservation.RESERVATION_DURATION_MINUTES * 60000)
  }

  isOverlappingWith(otherTime: Date): boolean {
    const otherEndTime = new Date(otherTime.getTime() + Reservation.RESERVATION_DURATION_MINUTES * 60000)
    return (
      (otherTime >= this.time && otherTime < this.getEndTime()) ||
      (otherEndTime > this.time && otherEndTime <= this.getEndTime())
    )
  }

  static create(time: Date, customerDetails: CustomerDetails, partySize: number): Reservation {
    return new Reservation(ReservationId.new(), time, customerDetails, partySize)
  }
}
