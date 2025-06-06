import { inject, injectable } from 'tsyringe'
import { GetFreeTables } from '../availability/GetFreeTables'
import { ReservationId } from '@/domain/reservations/ReservationId'
import { ReservationRepository } from '@/domain/reservations/ReservationRepository'
import { ReservationTableRepository } from '@/domain/reservations/ReservationTableRepository'
import { WaitListRepository } from '@/domain/waitlist/WaitListRepository'
import { CreateReservationCommand } from './CreateReservationCommand'

@injectable()
export class CreateReservation {
  constructor(
    @inject('GetFreeTables') private readonly getFreeTables: GetFreeTables,
    @inject('ReservationRepository') private readonly reservationRepository: ReservationRepository,
    @inject('ReservationTableRepository') private readonly reservationTableRepository: ReservationTableRepository,
    @inject('WaitListRepository') private readonly waitListRepository: WaitListRepository
  ) {}

  async execute(command: CreateReservationCommand): Promise<ReservationId> {
    const reservation = await this.reservationRepository.insert(command.reservation)
    const freeTables = await this.getFreeTables.execute({
      reservationTime: command.reservation.time,
      partySize: command.reservation.partySize
    })
    if (freeTables.length === 0) {
      await this.waitListRepository.add(reservation.id)
    } else {
      const table = freeTables[0]
      await this.reservationTableRepository.add(reservation.id, table.number)
    }
    return reservation.id
  }
}
