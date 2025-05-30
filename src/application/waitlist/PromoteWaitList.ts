import { injectable, inject } from 'tsyringe'
import { GetFreeTables } from '../availability/GetFreeTables'
import { GetFreeTablesQuery } from '../availability/GetFreeTablesQuery'
import { ReservationRepository } from '@/domain/reservations/ReservationRepository'
import { ReservationTableRepository } from '@/domain/reservations/ReservationTableRepository'
import { WaitListRepository } from '@/domain/waitlist/WaitListRepository'
import { PromoteWaitListCommand } from './PromoteWaitListCommand'

@injectable()
export class PromoteWaitList {
  constructor(
    @inject('GetFreeTables') private readonly getFreeTables: GetFreeTables,
    @inject('ReservationRepository') private readonly reservationRepository: ReservationRepository,
    @inject('ReservationTableRepository') private readonly reservationTableRepository: ReservationTableRepository,
    @inject('WaitListRepository') private readonly waitListRepository: WaitListRepository
  ) {}

  async execute(command: PromoteWaitListCommand): Promise<void> {
    const waitList = await this.waitListRepository.findAll()
    if (waitList.size === 0) {
      return
    }

    const allReservations = await this.reservationRepository.findAll()
    const reservationsWaiting = allReservations
      .filter(
        (reservation) =>
          reservation.time > command.from &&
          reservation.getEndTime() < command.to &&
          reservation.partySize <= command.maximumSeatingCapacity
      )
      .filter((reservation) => waitList.has(reservation.id))

    for (const reservation of reservationsWaiting) {
      const freeTables = await this.getFreeTables.execute(
        new GetFreeTablesQuery(reservation.time, reservation.partySize)
      )
      if (freeTables.length > 0) {
        await this.reservationTableRepository.add(reservation.id, freeTables[0].getTableNumber())
        await this.waitListRepository.remove(reservation.id)

        // This can be replaced sending a notification to the customer
        console.log(`Promoted reservation ${reservation.id.value} to table ${freeTables[0].getTableNumber().value}`)
      }
    }
  }
}
