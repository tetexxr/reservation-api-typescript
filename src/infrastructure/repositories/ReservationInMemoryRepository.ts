import { Reservation } from '@/domain/reservations/Reservation'
import { ReservationId } from '@/domain/reservations/ReservationId'
import { ReservationRepository } from '@/domain/reservations/ReservationRepository'

export class ReservationInMemoryRepository implements ReservationRepository {
  async insert(reservation: Reservation): Promise<Reservation> {
    ReservationInMemoryRepository.reservations.push(reservation)
    return reservation
  }

  async findById(reservationId: ReservationId): Promise<Reservation | null> {
    return (
      ReservationInMemoryRepository.reservations.find((reservation) => reservation.id.value === reservationId.value) ||
      null
    )
  }

  async update(reservation: Reservation): Promise<void> {
    const index = ReservationInMemoryRepository.reservations.findIndex((r) => r.id.value === reservation.id.value)
    ReservationInMemoryRepository.reservations[index] = reservation
  }

  async delete(reservationId: ReservationId): Promise<void> {
    const index = ReservationInMemoryRepository.reservations.findIndex((r) => r.id.value === reservationId.value)
    if (index !== -1) {
      ReservationInMemoryRepository.reservations.splice(index, 1)
    }
  }

  async findAll(name?: string): Promise<Reservation[]> {
    if (!name) {
      return ReservationInMemoryRepository.reservations
    }
    return ReservationInMemoryRepository.reservations.filter((reservation) =>
      this.matches(reservation.customerDetails.name, name)
    )
  }

  private matches(customerName: string, name: string): boolean {
    let lastIndexFound = 0
    for (const c of name) {
      const position = customerName.toLowerCase().indexOf(c.toLowerCase(), lastIndexFound)
      if (position !== -1) {
        lastIndexFound = position + 1
      } else {
        return false
      }
    }
    return true
  }

  private static readonly reservations: Reservation[] = []
}
