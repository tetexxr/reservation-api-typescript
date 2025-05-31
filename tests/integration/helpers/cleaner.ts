import { db } from '@/infrastructure/database/config'

export async function cleaner(): Promise<void> {
  await db.deleteFrom('reservations').execute()
  await db.deleteFrom('reservation_tables').execute()
  await db.deleteFrom('wait_list').execute()
}
