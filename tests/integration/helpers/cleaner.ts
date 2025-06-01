import { db } from '@/infrastructure/database/config'

export async function cleaner(options: CleanerOptions): Promise<void> {
  if (options.reservations) {
    await db.deleteFrom('reservations').execute()
  }
  if (options.reservationTables) {
    await db.deleteFrom('reservation_tables').execute()
  }
  if (options.waitList) {
    await db.deleteFrom('wait_list').execute()
  }
}

type CleanerOptions = {
  reservations?: boolean
  reservationTables?: boolean
  waitList?: boolean
}
