import 'reflect-metadata'
import { injectable, inject } from 'tsyringe'
import { ReservationRepository } from '@/domain/reservations/ReservationRepository'
import { ReservationTableRepository } from '@/domain/reservations/ReservationTableRepository'
import { WaitListRepository } from '@/domain/waitlist/WaitListRepository'

@injectable()
export class Cleaner {
  constructor(
    @inject('ReservationRepository') private readonly reservationRepository: ReservationRepository,
    @inject('ReservationTableRepository') private readonly reservationTableRepository: ReservationTableRepository,
    @inject('WaitListRepository') private readonly waitListRepository: WaitListRepository
  ) {}

  async execute(): Promise<void> {
    const reservations = await this.reservationRepository.findAll()
    for (const reservation of reservations) {
      await this.reservationRepository.delete(reservation.id)
    }

    const reservationTables = await this.reservationTableRepository.findAll()
    for (const [key] of reservationTables) {
      await this.reservationTableRepository.remove(key)
    }

    const waitList = await this.waitListRepository.findAll()
    for (const reservation of waitList) {
      await this.waitListRepository.remove(reservation)
    }
  }
}
