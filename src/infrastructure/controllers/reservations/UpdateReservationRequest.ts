import { UpdateReservationCommand } from '@/application/reservations/UpdateReservationCommand'
import { CustomerDetails } from '@/domain/reservations/CustomerDetails'
import { Reservation } from '@/domain/reservations/Reservation'
import { ReservationId } from '@/domain/reservations/ReservationId'

export class UpdateReservationRequest {
  constructor(
    public readonly time: Date,
    public readonly name: string,
    public readonly email: string,
    public readonly phoneNumber: string,
    public readonly partySize: number
  ) {}

  toCommand(reservationId: ReservationId): UpdateReservationCommand {
    return new UpdateReservationCommand(
      new Reservation(
        reservationId,
        this.time,
        new CustomerDetails(this.name, this.email, this.phoneNumber),
        this.partySize
      )
    )
  }
}
