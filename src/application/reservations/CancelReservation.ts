import { injectable, inject } from 'tsyringe'
import { PromoteWaitList } from '../waitlist/PromoteWaitList'
import { PromoteWaitListCommand } from '../waitlist/PromoteWaitListCommand'
import { ReservationRepository } from '@/domain/reservations/ReservationRepository'
import { ReservationTableRepository } from '@/domain/reservations/ReservationTableRepository'
import { WaitListRepository } from '@/domain/waitlist/WaitListRepository'
import { CancelReservationCommand } from './CancelReservationCommand'

@injectable()
export class CancelReservation {
  constructor(
    @inject('ReservationRepository') private readonly reservationRepository: ReservationRepository,
    @inject('ReservationTableRepository') private readonly reservationTableRepository: ReservationTableRepository,
    @inject('WaitListRepository') private readonly waitListRepository: WaitListRepository,
    @inject('PromoteWaitList') private readonly promoteWaitList: PromoteWaitList
  ) {}

  async execute(command: CancelReservationCommand): Promise<void> {
    const reservation = await this.reservationRepository.findById(command.reservationId)
    await this.reservationRepository.delete(command.reservationId)
    await this.reservationTableRepository.remove(command.reservationId)
    const isInWaitList = await this.waitListRepository.remove(command.reservationId)
    if (reservation !== null && !isInWaitList) {
      await this.promoteWaitList.execute(PromoteWaitListCommand.create(reservation))
    }
  }
}
