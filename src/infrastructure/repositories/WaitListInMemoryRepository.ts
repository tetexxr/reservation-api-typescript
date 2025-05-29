import { ReservationId } from '@/domain/reservations/ReservationId'
import { WaitListRepository } from '@/domain/waitlist/WaitListRepository'

export class WaitListInMemoryRepository implements WaitListRepository {
  async add(reservationId: ReservationId): Promise<void> {
    WaitListInMemoryRepository.waitList.add(reservationId)
  }

  async remove(reservationId: ReservationId): Promise<boolean> {
    return WaitListInMemoryRepository.waitList.delete(reservationId)
  }

  async findAll(): Promise<Set<ReservationId>> {
    return new Set(WaitListInMemoryRepository.waitList)
  }

  private static readonly waitList = new Set<ReservationId>()
}
