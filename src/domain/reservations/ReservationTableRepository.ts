import { ReservationId } from './ReservationId'
import { TableNumber } from '../tables/TableNumber'

export interface ReservationTableRepository {
  add(reservationId: ReservationId, tableNumber: TableNumber): void
  remove(reservationId: ReservationId): void
  findAll(): Map<ReservationId, TableNumber>
  findById(reservationId: ReservationId): TableNumber | null
}
