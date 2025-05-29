import { ReservationId } from './ReservationId'
import { TableNumber } from '../tables/TableNumber'

export interface ReservationTableRepository {
  add(reservationId: ReservationId, tableNumber: TableNumber): Promise<void>
  remove(reservationId: ReservationId): Promise<void>
  findAll(): Promise<Map<ReservationId, TableNumber>>
  findById(reservationId: ReservationId): Promise<TableNumber | null>
}
