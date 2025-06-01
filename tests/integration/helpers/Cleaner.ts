import 'reflect-metadata'
import { inject, injectable } from 'tsyringe'
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

  async execute(options: CleanerOptions): Promise<void> {
    if (options.reservations) {
      const reservations = await this.reservationRepository.findAll()
      for (const reservation of reservations) {
        await this.reservationRepository.delete(reservation.id)
      }
    }
    if (options.reservationTables) {
      const reservationTables = await this.reservationTableRepository.findAll()
      for (const [key] of reservationTables) {
        await this.reservationTableRepository.remove(key)
      }
    }
    if (options.waitList) {
      const waitList = await this.waitListRepository.findAll()
      for (const reservation of waitList) {
        await this.waitListRepository.remove(reservation)
      }
    }
  }
}

type CleanerOptions = {
  reservations?: boolean
  reservationTables?: boolean
  waitList?: boolean
}
