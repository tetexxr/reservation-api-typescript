import { ReservationId } from '../reservations/ReservationId'

export interface WaitListRepository {
  add(reservationId: ReservationId): Promise<void>
  remove(reservationId: ReservationId): Promise<boolean>
  findAll(): Promise<Set<ReservationId>>
}
