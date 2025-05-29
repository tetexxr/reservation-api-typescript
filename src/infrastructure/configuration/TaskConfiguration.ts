import { container } from 'tsyringe'
import { SendNotificationTask } from '@/infrastructure/tasks/SendNotificationTask'

export class TaskConfiguration {
  static configure(): void {
    container.registerSingleton<SendNotificationTask>('SendNotificationTask', SendNotificationTask)
    container.resolve<SendNotificationTask>('SendNotificationTask')
  }
}
