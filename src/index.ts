import 'reflect-metadata'
import { container } from 'tsyringe'
import { build } from './main'
import { ApplicationConfiguration } from './infrastructure/configuration/ApplicationConfiguration'
import { ControllerConfiguration } from '@/infrastructure/configuration/ControllerConfiguration'
import { RepositoryConfiguration } from './infrastructure/configuration/RepositoryConfiguration'
import { TaskConfiguration } from './infrastructure/configuration/TaskConfiguration'
import { AvailabilityController } from './infrastructure/controllers/availability/AvailabilityController'
import { ReservationController } from './infrastructure/controllers/reservations/ReservationController'
import { SendNotificationTask } from '@/infrastructure/tasks/SendNotificationTask'

const bootstrap = async (): Promise<void> => {
  // Configure dependencies
  ApplicationConfiguration.configure()
  ControllerConfiguration.configure()
  RepositoryConfiguration.configure()
  TaskConfiguration.configure()

  const app = await build()

  // Register routes
  container.resolve<AvailabilityController>('AvailabilityController').registerRoutes(app)
  container.resolve<ReservationController>('ReservationController').registerRoutes(app)

  // Start background tasks
  container.resolve<SendNotificationTask>('SendNotificationTask')

  await app.listen({ port: 3000 })
}

bootstrap()
