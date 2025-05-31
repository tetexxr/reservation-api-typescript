import { injectable } from 'tsyringe'
import { db } from '../database/config'
import { ReservationId } from '@/domain/reservations/ReservationId'
import { WaitListRepository } from '@/domain/waitlist/WaitListRepository'

@injectable()
export class WaitListMysqlRepository implements WaitListRepository {
  async add(reservationId: ReservationId): Promise<void> {
    await db
      .insertInto('wait_list')
      .values({
        reservation_id: reservationId.value
      })
      .execute()
  }

  async remove(reservationId: ReservationId): Promise<boolean> {
    const result = await db.deleteFrom('wait_list').where('reservation_id', '=', reservationId.value).execute()
    return result.length == 1
  }

  async findAll(): Promise<Set<ReservationId>> {
    const reservations = await db.selectFrom('wait_list').select('reservation_id').execute()
    return new Set(reservations.map((r) => new ReservationId(r.reservation_id)))
  }
}
