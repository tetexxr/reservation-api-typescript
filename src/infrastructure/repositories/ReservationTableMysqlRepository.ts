import { injectable } from 'tsyringe'
import { db } from '@/infrastructure/database/config'
import { ReservationId } from '@/domain/reservations/ReservationId'
import { ReservationTableRepository } from '@/domain/reservations/ReservationTableRepository'
import { TableNumber } from '@/domain/tables/TableNumber'

@injectable()
export class ReservationTableMysqlRepository implements ReservationTableRepository {
  async add(reservationId: ReservationId, tableNumber: TableNumber): Promise<void> {
    await db
      .insertInto('reservationTables')
      .values({
        reservationId: reservationId.value,
        tableNumber: tableNumber.value
      })
      .execute()
  }

  async remove(reservationId: ReservationId): Promise<void> {
    await db.deleteFrom('reservationTables').where('reservationId', '=', reservationId.value).execute()
  }

  async findAll(): Promise<Map<ReservationId, TableNumber>> {
    const results = await db.selectFrom('reservationTables').selectAll().orderBy('tableNumber', 'asc').execute()
    return new Map(results.map((r) => [new ReservationId(r.reservationId), new TableNumber(r.tableNumber)]))
  }

  async findById(reservationId: ReservationId): Promise<TableNumber | null> {
    const result = await db
      .selectFrom('reservationTables')
      .select('tableNumber')
      .where('reservationId', '=', reservationId.value)
      .executeTakeFirst()
    return result ? new TableNumber(result.tableNumber) : null
  }
}
