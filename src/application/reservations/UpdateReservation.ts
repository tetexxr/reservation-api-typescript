import { inject, injectable } from 'tsyringe'
import { GetFreeTables } from '../availability/GetFreeTables'
import { ReservationRepository } from '@/domain/reservations/ReservationRepository'
import { ReservationTableRepository } from '@/domain/reservations/ReservationTableRepository'
import { WaitListRepository } from '@/domain/waitlist/WaitListRepository'
import { UpdateReservationCommand } from './UpdateReservationCommand'

@injectable()
export class UpdateReservation {
  constructor(
    @inject('GetFreeTables') private readonly getFreeTables: GetFreeTables,
    @inject('ReservationRepository') private readonly reservationRepository: ReservationRepository,
    @inject('ReservationTableRepository') private readonly reservationTableRepository: ReservationTableRepository,
    @inject('WaitListRepository') private readonly waitListRepository: WaitListRepository
  ) {}

  async execute(command: UpdateReservationCommand): Promise<void> {
    await this.reservationTableRepository.remove(command.reservation.id)
    await this.waitListRepository.remove(command.reservation.id)
    await this.reservationRepository.update(command.reservation)
    const freeTables = await this.getFreeTables.execute({
      reservationTime: command.reservation.time,
      partySize: command.reservation.partySize
    })
    if (freeTables.length === 0) {
      await this.waitListRepository.add(command.reservation.id)
    } else {
      const table = freeTables[0]
      await this.reservationTableRepository.add(command.reservation.id, table.number)
    }
  }
}
