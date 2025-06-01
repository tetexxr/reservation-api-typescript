import { injectable } from 'tsyringe'
import { db } from '@/infrastructure/database/config'
import { Reservation } from '@/domain/reservations/Reservation'
import { ReservationId } from '@/domain/reservations/ReservationId'
import { ReservationRepository } from '@/domain/reservations/ReservationRepository'
import { CustomerDetails } from '@/domain/reservations/CustomerDetails'

@injectable()
export class ReservationMysqlRepository implements ReservationRepository {
  async insert(reservation: Reservation): Promise<Reservation> {
    await db
      .insertInto('reservations')
      .values({
        id: reservation.id.value,
        time: reservation.time,
        customerName: reservation.customerDetails.name,
        customerEmail: reservation.customerDetails.email,
        customerPhoneNumber: reservation.customerDetails.phoneNumber,
        partySize: reservation.partySize
      })
      .execute()

    return reservation
  }

  async findById(reservationId: ReservationId): Promise<Reservation | null> {
    const result = await db
      .selectFrom('reservations')
      .selectAll()
      .where('id', '=', reservationId.value)
      .executeTakeFirst()

    if (!result) {
      return null
    }

    return new Reservation(
      new ReservationId(result.id),
      result.time,
      new CustomerDetails(result.customerName, result.customerEmail, result.customerPhoneNumber),
      result.partySize
    )
  }

  async update(reservation: Reservation): Promise<void> {
    await db
      .updateTable('reservations')
      .set({
        customerName: reservation.customerDetails.name,
        customerEmail: reservation.customerDetails.email,
        customerPhoneNumber: reservation.customerDetails.phoneNumber,
        partySize: reservation.partySize,
        time: reservation.time
      })
      .where('id', '=', reservation.id.value)
      .execute()
  }

  async delete(reservationId: ReservationId): Promise<void> {
    await db.deleteFrom('reservations').where('id', '=', reservationId.value).execute()
  }

  async findAll(name?: string): Promise<Reservation[]> {
    const results = await db.selectFrom('reservations').selectAll().orderBy('time', 'asc').execute()

    const filteredResults = !name
      ? results
      : results.filter((reservation) => this.matches(reservation.customerName, name))

    return filteredResults.map(
      (result) =>
        new Reservation(
          new ReservationId(result.id),
          result.time,
          new CustomerDetails(result.customerName, result.customerEmail, result.customerPhoneNumber),
          result.partySize
        )
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
}
