import 'reflect-metadata'
import { container } from 'tsyringe'
import { build } from './main'
import { ApplicationConfiguration } from './infrastructure/configuration/ApplicationConfiguration'
import { ControllerConfiguration } from '@/infrastructure/configuration/ControllerConfiguration'
import { RepositoryConfiguration } from './infrastructure/configuration/RepositoryConfiguration'
import { TaskConfiguration } from './infrastructure/configuration/TaskConfiguration'
import { AvailabilityController } from './infrastructure/controllers/availability/AvailabilityController'
import { ReservationController } from './infrastructure/controllers/reservations/ReservationController'

const bootstrap = async (): Promise<void> => {
  // Configure dependencies
  ApplicationConfiguration.configure()
  ControllerConfiguration.configure()
  RepositoryConfiguration.configure()
  TaskConfiguration.configure()

  const app = await build()

  // Resolve controllers
  const availabilityController = container.resolve<AvailabilityController>('AvailabilityController')
  const reservationController = container.resolve<ReservationController>('ReservationController')

  // Register routes
  availabilityController.registerRoutes(app)
  reservationController.registerRoutes(app)

  await app.listen({ port: 3000 })
}

bootstrap()
