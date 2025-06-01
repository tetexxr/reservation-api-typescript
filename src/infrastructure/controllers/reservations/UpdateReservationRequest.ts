import { UpdateReservationCommand } from '@/application/reservations/UpdateReservationCommand'
import { CustomerDetails } from '@/domain/reservations/CustomerDetails'
import { Reservation } from '@/domain/reservations/Reservation'
import { ReservationId } from '@/domain/reservations/ReservationId'

export type UpdateReservationRequest = {
  time: Date
  name: string
  email: string
  phoneNumber: string
  partySize: number
}

export function toCommand(request: UpdateReservationRequest, reservationId: ReservationId): UpdateReservationCommand {
  return {
    reservation: new Reservation(
      reservationId,
      new Date(request.time),
      new CustomerDetails(request.name, request.email, request.phoneNumber),
      request.partySize
    )
  }
}
