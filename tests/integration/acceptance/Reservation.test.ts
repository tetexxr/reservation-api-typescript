import 'reflect-metadata'
import { describe, it, beforeEach, expect } from 'vitest'
import app from '@/app'
import { container } from 'tsyringe'
import { ReservationRepository } from '@/domain/reservations/ReservationRepository'
import { CustomerDetails } from '@/domain/reservations/CustomerDetails'
import { Reservation } from '@/domain/reservations/Reservation'
import { ReservationId } from '@/domain/reservations/ReservationId'
import { Cleaner } from '../helpers/Cleaner'

describe('Reservation', () => {
  const reservationRepository = container.resolve<ReservationRepository>('ReservationRepository')
  const cleaner = container.resolve(Cleaner)

  beforeEach(async () => {
    await cleaner.execute()
  })

  async function insertReservation(numberToAdd: number): Promise<void> {
    await reservationRepository.insert(
      Reservation.create(
        new Date(`2021-10-1${numberToAdd}T10:00:00`),
        new CustomerDetails(`John ${numberToAdd}`, `john-${numberToAdd}@test.com`, '931111111'),
        4
      )
    )
  }

  it('should create a reservation', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/v1/reservations',
      payload: {
        time: '2021-10-10T10:00:00',
        name: 'John',
        email: 'john@test.com',
        phoneNumber: '931111111',
        partySize: 4
      }
    })

    expect(response.statusCode).toBe(201)
    expect(JSON.parse(response.body)).toHaveProperty('reservationId')
  })

  it('should update a reservation', async () => {
    await reservationRepository.insert(
      new Reservation(
        new ReservationId('reservation-id-1'),
        new Date('2021-10-10T10:00:00'),
        new CustomerDetails('John', 'john@test.com', '931111111'),
        4
      )
    )

    const response = await app.inject({
      method: 'PUT',
      url: '/v1/reservations/reservation-id-1',
      payload: {
        time: '2021-10-10T11:00:00',
        name: 'John Doe',
        email: 'john@test.com',
        phoneNumber: '931111111',
        partySize: 6
      }
    })

    expect(response.statusCode).toBe(204)
  })

  it('should delete a reservation', async () => {
    await reservationRepository.insert(
      new Reservation(
        new ReservationId('reservation-id-2'),
        new Date('2021-10-10T10:00:00'),
        new CustomerDetails('John', 'john@test.com', '931111111'),
        4
      )
    )

    const response = await app.inject({
      method: 'DELETE',
      url: '/v1/reservations/reservation-id-2'
    })

    expect(response.statusCode).toBe(204)
    expect(await reservationRepository.findById(new ReservationId('some-reservation-id'))).toBeNull()
  })

  it('should get all reservations', async () => {
    for (let i = 1; i <= 5; i++) {
      await reservationRepository.insert(
        Reservation.create(
          new Date('2021-10-10T10:00:00'),
          new CustomerDetails(`John ${i}`, 'john@test.com', '931111111'),
          4
        )
      )
    }

    const response = await app.inject({
      method: 'GET',
      url: '/v1/reservations'
    })

    const body = JSON.parse(response.body)
    expect(body.items).toHaveLength(5)
    expect(body.total).toBe(5)
    expect(body.items[0].name).toBe('John 1')
    expect(body.items[4].name).toBe('John 5')
  })

  it('should get all reservations by name', async () => {
    await insertReservation(0)
    await insertReservation(0)
    await insertReservation(1)

    const response = await app.inject({
      method: 'GET',
      url: '/v1/reservations',
      query: { name: 'John 0' }
    })

    const body = JSON.parse(response.body)
    expect(body.items).toHaveLength(2)
    expect(body.total).toBe(2)
    expect(body.items[0].name).toBe('John 0')
    expect(body.items[1].name).toBe('John 0')
  })
})
