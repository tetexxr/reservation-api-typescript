import { Reservation } from './Reservation'
import { ReservationId } from './ReservationId'

export interface ReservationRepository {
  insert(reservation: Reservation): Promise<Reservation>
  findById(reservationId: ReservationId): Promise<Reservation | null>
  update(reservation: Reservation): Promise<void>
  delete(reservationId: ReservationId): Promise<void>
  findAll(name?: string): Promise<Reservation[]>
}
