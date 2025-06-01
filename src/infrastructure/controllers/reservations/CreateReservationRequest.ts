import { CreateReservationCommand } from '@/application/reservations/CreateReservationCommand'
import { CustomerDetails } from '@/domain/reservations/CustomerDetails'
import { Reservation } from '@/domain/reservations/Reservation'

export class CreateReservationRequest {
  constructor(
    public readonly time: Date,
    public readonly name: string,
    public readonly email: string,
    public readonly phoneNumber: string,
    public readonly partySize: number
  ) {}

  toCommand(): CreateReservationCommand {
    return {
      reservation: Reservation.create(
        this.time,
        new CustomerDetails(this.name, this.email, this.phoneNumber),
        this.partySize
      )
    }
  }
}
