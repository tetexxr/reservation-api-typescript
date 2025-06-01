import { CreateReservationCommand } from '@/application/reservations/CreateReservationCommand'
import { CustomerDetails } from '@/domain/reservations/CustomerDetails'
import { Reservation } from '@/domain/reservations/Reservation'

export type CreateReservationRequest = {
  time: Date
  name: string
  email: string
  phoneNumber: string
  partySize: number
}

export function toCommand(request: CreateReservationRequest): CreateReservationCommand {
  return {
    reservation: Reservation.create(
      new Date(request.time),
      new CustomerDetails(request.name, request.email, request.phoneNumber),
      request.partySize
    )
  }
}
