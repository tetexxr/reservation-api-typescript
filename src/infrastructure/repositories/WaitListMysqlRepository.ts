import { injectable } from 'tsyringe'
import { db } from '../database/config'
import { ReservationId } from '@/domain/reservations/ReservationId'
import { WaitListRepository } from '@/domain/waitlist/WaitListRepository'

@injectable()
export class WaitListMysqlRepository implements WaitListRepository {
  async add(reservationId: ReservationId): Promise<void> {
    await db
      .insertInto('waitList')
      .values({
        reservationId: reservationId.value
      })
      .execute()
  }

  async remove(reservationId: ReservationId): Promise<boolean> {
    const result = await db.deleteFrom('waitList').where('reservationId', '=', reservationId.value).execute()
    return result.length == 1
  }

  async findAll(): Promise<Set<ReservationId>> {
    const reservations = await db.selectFrom('waitList').selectAll().execute()
    return new Set(reservations.map((r) => new ReservationId(r.reservationId)))
  }
}
