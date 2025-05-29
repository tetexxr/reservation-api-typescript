import { GetFreeTables } from '../availability/GetFreeTables'
import { GetFreeTablesQuery } from '../availability/GetFreeTablesQuery'
import { ReservationRepository } from '@/domain/reservations/ReservationRepository'
import { ReservationTableRepository } from '@/domain/reservations/ReservationTableRepository'
import { WaitListRepository } from '@/domain/waitlist/WaitListRepository'
import { UpdateReservationCommand } from './UpdateReservationCommand'

export class UpdateReservation {
  constructor(
    private readonly getFreeTables: GetFreeTables,
    private readonly reservationRepository: ReservationRepository,
    private readonly reservationTableRepository: ReservationTableRepository,
    private readonly waitListRepository: WaitListRepository
  ) {}

  async execute(command: UpdateReservationCommand): Promise<void> {
    await this.reservationTableRepository.remove(command.reservation.getId())
    await this.waitListRepository.remove(command.reservation.getId())
    await this.reservationRepository.update(command.reservation)
    const query = new GetFreeTablesQuery(command.reservation.getTime(), command.reservation.getPartySize())
    const freeTables = await this.getFreeTables.execute(query)
    if (freeTables.length === 0) {
      await this.waitListRepository.add(command.reservation.getId())
    } else {
      const table = freeTables[0]
      await this.reservationTableRepository.add(command.reservation.getId(), table.getTableNumber())
    }
  }
}
