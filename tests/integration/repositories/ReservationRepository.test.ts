import 'reflect-metadata'
import { describe, it, expect, beforeEach } from 'vitest'
import { container } from 'tsyringe'
import { cleaner } from '../helpers/cleaner'
import { ReservationRepository } from '@/domain/reservations/ReservationRepository'
import { Reservation } from '@/domain/reservations/Reservation'
import { CustomerDetails } from '@/domain/reservations/CustomerDetails'

describe('ReservationRepository', () => {
  const repository = container.resolve<ReservationRepository>('ReservationRepository')

  beforeEach(async () => {
    await cleaner()
  })

  it('should insert a reservation', async () => {
    const reservation = Reservation.create(new Date(), new CustomerDetails('John', 'john@test.com', '931111111'), 4)
    await repository.insert(reservation)
    const found = await repository.findById(reservation.id)
    expect(found).toEqual(reservation)
  })

  it('should update a reservation', async () => {
    const reservation = Reservation.create(new Date(), new CustomerDetails('John', 'john@test.com', '931111111'), 4)
    await repository.insert(reservation)
    const updatedReservation = new Reservation(
      reservation.id,
      reservation.time,
      new CustomerDetails('John Doe', reservation.customerDetails.email, reservation.customerDetails.phoneNumber),
      reservation.partySize
    )
    await repository.update(updatedReservation)
    const found = await repository.findById(reservation.id)
    expect(found?.customerDetails.name).toBe('John Doe')
  })

  it('should delete a reservation', async () => {
    const reservation = Reservation.create(new Date(), new CustomerDetails('John', 'john@test.com', '931111111'), 4)
    await repository.insert(reservation)
    await repository.delete(reservation.id)
    const found = await repository.findById(reservation.id)
    expect(found).toBeNull()
  })

  it('should retrieve all reservations', async () => {
    for (let i = 1; i <= 5; i++) {
      await repository.insert(
        Reservation.create(
          new Date(`2021-10-1${i}T10:00:00`),
          new CustomerDetails(`John ${i}`, `john-${i}@test.com`, '931111111'),
          4
        )
      )
    }
    const reservations = await repository.findAll()
    expect(reservations).toHaveLength(5)
    expect(reservations[0].customerDetails.name).toBe('John 1')
    expect(reservations[2].time).toEqual(new Date('2021-10-13T10:00:00'))
    expect(reservations[4].customerDetails.email).toBe('john-5@test.com')
  })

  it('should retrieve all reservations by name', async () => {
    await insertReservation(0)
    await insertReservation(0)
    await insertReservation(1)
    const reservations = await repository.findAll('John 0')
    expect(reservations).toHaveLength(2)
    expect(reservations[0].customerDetails.name).toBe('John 0')
    expect(reservations[1].customerDetails.name).toBe('John 0')
  })

  it('should retrieve all reservations by letters in order of appearance', async () => {
    await repository.insert(
      Reservation.create(
        new Date('2021-10-10T10:00:00'),
        new CustomerDetails('John Doe', 'john@test.com', '931111111'),
        4
      )
    )
    const reservations = await repository.findAll('jho')
    expect(reservations).toHaveLength(1)
    expect(reservations[0].customerDetails.name).toBe('John Doe')
  })

  it('should not retrieve all reservations by letters in order of appearance when not found', async () => {
    await repository.insert(
      Reservation.create(
        new Date('2021-10-10T10:00:00'),
        new CustomerDetails('John Doe', 'john@test.com', '931111111'),
        4
      )
    )
    const reservations = await repository.findAll('jooo')
    expect(reservations).toHaveLength(0)
  })

  async function insertReservation(numberToAdd: number): Promise<void> {
    await repository.insert(
      Reservation.create(
        new Date(`2021-10-1${numberToAdd}T10:00:00`),
        new CustomerDetails(`John ${numberToAdd}`, `john-${numberToAdd}@test.com`, '931111111'),
        4
      )
    )
  }
})
