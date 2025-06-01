import { Reservation } from '@/domain/reservations/Reservation'

export type GetReservationsResponse = {
  items: ReservationDto[]
  total: number
}

export type ReservationDto = {
  id: string
  time: Date
  name: string
  email: string
  phoneNumber: string
  partySize: number
}

export function toDto(reservations: Reservation[]): GetReservationsResponse {
  return {
    items: reservations.map((reservation) => ({
      id: reservation.id.value,
      time: reservation.time,
      name: reservation.customerDetails.name,
      email: reservation.customerDetails.email,
      phoneNumber: reservation.customerDetails.phoneNumber,
      partySize: reservation.partySize
    })),
    total: reservations.length
  }
}
