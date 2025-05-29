import { ReservationId } from '../reservations/ReservationId'

export interface WaitListRepository {
  add(reservationId: ReservationId): void
  remove(reservationId: ReservationId): boolean
  findAll(): Set<ReservationId>
}
