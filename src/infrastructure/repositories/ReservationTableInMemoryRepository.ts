import { ReservationId } from '@/domain/reservations/ReservationId'
import { ReservationTableRepository } from '@/domain/reservations/ReservationTableRepository'
import { TableNumber } from '@/domain/tables/TableNumber'

export class ReservationTableInMemoryRepository implements ReservationTableRepository {
  async add(reservationId: ReservationId, tableNumber: TableNumber): Promise<void> {
    ReservationTableInMemoryRepository.reservationTables.set(reservationId, tableNumber)
  }

  async remove(reservationId: ReservationId): Promise<void> {
    ReservationTableInMemoryRepository.reservationTables.delete(reservationId)
  }

  async findAll(): Promise<Map<ReservationId, TableNumber>> {
    return new Map(ReservationTableInMemoryRepository.reservationTables)
  }

  async findById(reservationId: ReservationId): Promise<TableNumber | null> {
    return ReservationTableInMemoryRepository.reservationTables.get(reservationId) || null
  }

  private static readonly reservationTables = new Map<ReservationId, TableNumber>()
}
