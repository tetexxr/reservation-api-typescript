import { container } from 'tsyringe'
import { NotificationRepository } from '@/domain/notifications/NotificationRepository'
import { ReservationRepository } from '@/domain/reservations/ReservationRepository'
import { ReservationTableRepository } from '@/domain/reservations/ReservationTableRepository'
import { TableRepository } from '@/domain/tables/TableRepository'
import { WaitListRepository } from '@/domain/waitlist/WaitListRepository'
import { NotificationLoggerRepository } from '@/infrastructure/repositories/NotificationLoggerRepository'
import { ReservationInMemoryRepository } from '@/infrastructure/repositories/ReservationInMemoryRepository'
import { ReservationTableInMemoryRepository } from '@/infrastructure/repositories/ReservationTableInMemoryRepository'
import { TableInMemoryRepository } from '@/infrastructure/repositories/TableInMemoryRepository'
import { WaitListInMemoryRepository } from '@/infrastructure/repositories/WaitListInMemoryRepository'
import { TableMysqlRepository } from '@/infrastructure/repositories/TableMysqlRepository'

const USE_IN_MEMORY_REPOSITORIES = false

export class RepositoryConfiguration {
  static configure(): void {
    if (USE_IN_MEMORY_REPOSITORIES) {
      container.registerSingleton<ReservationRepository>('ReservationRepository', ReservationInMemoryRepository)
      container.registerSingleton<TableRepository>('TableRepository', TableInMemoryRepository)
      container.registerSingleton<ReservationTableRepository>(
        'ReservationTableRepository',
        ReservationTableInMemoryRepository
      )
      container.registerSingleton<WaitListRepository>('WaitListRepository', WaitListInMemoryRepository)
      container.registerSingleton<NotificationRepository>('NotificationRepository', NotificationLoggerRepository)
    } else {
      container.registerSingleton<ReservationRepository>('ReservationRepository', ReservationInMemoryRepository)
      container.registerSingleton<TableRepository>('TableRepository', TableMysqlRepository)
      container.registerSingleton<ReservationTableRepository>(
        'ReservationTableRepository',
        ReservationTableInMemoryRepository
      )
      container.registerSingleton<WaitListRepository>('WaitListRepository', WaitListInMemoryRepository)
      container.registerSingleton<NotificationRepository>('NotificationRepository', NotificationLoggerRepository)
    }
  }
}
