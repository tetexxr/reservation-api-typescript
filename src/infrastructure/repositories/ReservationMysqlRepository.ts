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
        customer_name: reservation.customerDetails.name,
        customer_email: reservation.customerDetails.email,
        customer_phone_number: reservation.customerDetails.phoneNumber,
        party_size: reservation.partySize
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
      new CustomerDetails(result.customer_name, result.customer_email, result.customer_phone_number),
      result.party_size
    )
  }

  async update(reservation: Reservation): Promise<void> {
    await db
      .updateTable('reservations')
      .set({
        customer_name: reservation.customerDetails.name,
        customer_email: reservation.customerDetails.email,
        customer_phone_number: reservation.customerDetails.phoneNumber,
        party_size: reservation.partySize,
        time: reservation.time
      })
      .where('id', '=', reservation.id.value)
      .execute()
  }

  async delete(reservationId: ReservationId): Promise<void> {
    await db.deleteFrom('reservations').where('id', '=', reservationId.value).execute()
  }

  async findAll(name?: string): Promise<Reservation[]> {
    const results = await db.selectFrom('reservations').selectAll().execute()

    const filteredResults = !name
      ? results
      : results.filter((reservation) => this.matches(reservation.customer_name, name))

    return filteredResults.map(
      (result) =>
        new Reservation(
          new ReservationId(result.id),
          result.time,
          new CustomerDetails(result.customer_name, result.customer_email, result.customer_phone_number),
          result.party_size
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
