import { GetFreeTables } from '../availability/GetFreeTables'
import { GetFreeTablesQuery } from '../availability/GetFreeTablesQuery'
import { ReservationRepository } from '../../domain/reservations/ReservationRepository'
import { ReservationTableRepository } from '../../domain/reservations/ReservationTableRepository'
import { WaitListRepository } from '../../domain/waitlist/WaitListRepository'
import { PromoteWaitListCommand } from './PromoteWaitListCommand'

export class PromoteWaitList {
  constructor(
    private readonly getFreeTables: GetFreeTables,
    private readonly reservationRepository: ReservationRepository,
    private readonly reservationTableRepository: ReservationTableRepository,
    private readonly waitListRepository: WaitListRepository
  ) {}

  async execute(command: PromoteWaitListCommand): Promise<void> {
    const waitList = await this.waitListRepository.findAll()
    if (waitList.size === 0) {
      return
    }

    const reservationsWaiting = (await this.reservationRepository.findAll())
      .filter(
        (reservation) =>
          reservation.getTime() > command.from &&
          reservation.getEndTime() < command.to &&
          reservation.getPartySize() <= command.maximumSeatingCapacity
      )
      .filter((reservation) => waitList.has(reservation.getId()))

    for (const reservation of reservationsWaiting) {
      const freeTables = await this.getFreeTables.execute(
        new GetFreeTablesQuery(reservation.getTime(), reservation.getPartySize())
      )
      if (freeTables.length > 0) {
        await this.reservationTableRepository.add(reservation.getId(), freeTables[0].getTableNumber())
        await this.waitListRepository.remove(reservation.getId())

        // This can be replaced sending a notification to the customer
        console.log(
          `Promoted reservation ${reservation.getId().value} to table ${freeTables[0].getTableNumber().value}`
        )
      }
    }
  }
}
