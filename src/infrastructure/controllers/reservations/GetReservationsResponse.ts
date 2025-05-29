import { Reservation } from '@/domain/reservations/Reservation'

export class GetReservationsResponse {
  constructor(
    public readonly items: ReservationDto[],
    public readonly total: number = items.length
  ) {}
}

export class ReservationDto {
  constructor(
    public readonly id: string,
    public readonly time: Date,
    public readonly name: string,
    public readonly email: string,
    public readonly phoneNumber: string,
    public readonly partySize: number
  ) {}
}

export function toDto(reservations: Reservation[]): GetReservationsResponse {
  return new GetReservationsResponse(
    reservations.map(
      (reservation) =>
        new ReservationDto(
          reservation.id.value,
          reservation.time,
          reservation.customerDetails.name,
          reservation.customerDetails.email,
          reservation.customerDetails.phoneNumber,
          reservation.partySize
        )
    )
  )
}
