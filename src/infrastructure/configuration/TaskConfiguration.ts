import { container } from 'tsyringe'
import { SendNotificationTask } from '@/infrastructure/tasks/SendNotificationTask'

export class TaskConfiguration {
  static configure(): void {
    container.resolve(SendNotificationTask)
  }
}
