import { injectable } from 'tsyringe'
import { db } from '@/infrastructure/database/config'
import { ReservationId } from '@/domain/reservations/ReservationId'
import { ReservationTableRepository } from '@/domain/reservations/ReservationTableRepository'
import { TableNumber } from '@/domain/tables/TableNumber'

@injectable()
export class ReservationTableMysqlRepository implements ReservationTableRepository {
  async add(reservationId: ReservationId, tableNumber: TableNumber): Promise<void> {
    await db
      .insertInto('reservation_tables')
      .values({
        reservation_id: reservationId.value,
        table_number: tableNumber.value
      })
      .execute()
  }

  async remove(reservationId: ReservationId): Promise<void> {
    await db.deleteFrom('reservation_tables').where('reservation_id', '=', reservationId.value).execute()
  }

  async findAll(): Promise<Map<ReservationId, TableNumber>> {
    const results = await db.selectFrom('reservation_tables').selectAll().orderBy('table_number', 'asc').execute()
    return new Map(results.map((r) => [new ReservationId(r.reservation_id), new TableNumber(r.table_number)]))
  }

  async findById(reservationId: ReservationId): Promise<TableNumber | null> {
    const result = await db
      .selectFrom('reservation_tables')
      .select('table_number')
      .where('reservation_id', '=', reservationId.value)
      .executeTakeFirst()
    return result ? new TableNumber(result.table_number) : null
  }
}
