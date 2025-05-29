import { container } from 'tsyringe'
import { ReservationController } from '@/infrastructure/controllers/reservations/ReservationController'
import { AvailabilityController } from '@/infrastructure/controllers/availability/AvailabilityController'

export class ControllerConfiguration {
  static configure(): void {
    container.registerSingleton<ReservationController>('ReservationController', ReservationController)
    container.registerSingleton<AvailabilityController>('AvailabilityController', AvailabilityController)
  }
}
