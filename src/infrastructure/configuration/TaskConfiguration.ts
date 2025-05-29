import { container } from 'tsyringe'
import { SendNotificationTask } from '@/infrastructure/tasks/SendNotificationTask'

export class ApplicationConfiguration {
  static configure(): void {
    container.resolve(SendNotificationTask)
  }
}
