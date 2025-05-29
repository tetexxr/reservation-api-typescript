import { container } from 'tsyringe'
import { GetAvailableSlots } from '@/application/availability/GetAvailableSlots'
import { GetFreeTables } from '@/application/availability/GetFreeTables'
import { SendNotification } from '@/application/notifications/SendNotification'
import { CancelReservation } from '@/application/reservations/CancelReservation'
import { CreateReservation } from '@/application/reservations/CreateReservation'
import { UpdateReservation } from '@/application/reservations/UpdateReservation'
import { PromoteWaitList } from '@/application/waitlist/PromoteWaitList'

export class ApplicationConfiguration {
  static configure(): void {
    container.registerSingleton<GetFreeTables>('GetFreeTables', GetFreeTables)
    container.registerSingleton<CreateReservation>('CreateReservation', CreateReservation)
    container.registerSingleton<UpdateReservation>('UpdateReservation', UpdateReservation)
    container.registerSingleton<CancelReservation>('CancelReservation', CancelReservation)
    container.registerSingleton<SendNotification>('SendNotification', SendNotification)
    container.registerSingleton<PromoteWaitList>('PromoteWaitList', PromoteWaitList)
    container.registerSingleton<GetAvailableSlots>('GetAvailableSlots', GetAvailableSlots)
  }
}
