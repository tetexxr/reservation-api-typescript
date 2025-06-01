import 'reflect-metadata'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import app from '@/app'
import { container } from 'tsyringe'
import { CreateReservation } from '@/application/reservations/CreateReservation'
import { CreateReservationCommand } from '@/application/reservations/CreateReservationCommand'
import { CustomerDetails } from '@/domain/reservations/CustomerDetails'
import { Reservation } from '@/domain/reservations/Reservation'
import { Cleaner } from '../helpers/Cleaner'
import { seedTables } from '../helpers/seeds'

describe('Availability', () => {
  const createReservation = container.resolve(CreateReservation)
  const cleaner = container.resolve(Cleaner)

  beforeAll(async () => {
    await seedTables()
  })

  beforeEach(async () => {
    await cleaner.execute({ reservations: true, reservationTables: true })
  })

  it('should get all available slots', async () => {
    const times = [
      '2021-10-10T08:00:00',
      '2021-10-10T08:30:00',
      '2021-10-10T09:00:00',
      '2021-10-10T09:25:00',
      '2021-10-10T09:50:00',
      '2021-10-10T10:25:00',
      '2021-10-10T10:45:00',
      '2021-10-10T11:15:00',
      '2021-10-10T11:55:00',
      '2021-10-10T12:10:00',
      '2021-10-10T12:50:00',
      '2021-10-10T13:15:00'
    ]
    for (const t of times) {
      await createReservation.execute(new CreateReservationCommand(reservationAt(new Date(t))))
    }

    const response = await app.inject({
      method: 'GET',
      url: '/v1/availability',
      query: { date: '2021-10-10', partySize: '4' }
    })

    expect(JSON.parse(response.body)).toEqual({
      items: [
        {
          from: '2021-10-10T08:00:00',
          to: '2021-10-10T08:15:00',
          tableNumber: 4
        },
        {
          from: '2021-10-10T08:15:00',
          to: '2021-10-10T08:30:00',
          tableNumber: 4
        },
        {
          from: '2021-10-10T08:45:00',
          to: '2021-10-10T09:00:00',
          tableNumber: 3
        },
        {
          from: '2021-10-10T10:10:00',
          to: '2021-10-10T10:25:00',
          tableNumber: 4
        },
        {
          from: '2021-10-10T11:30:00',
          to: '2021-10-10T11:45:00',
          tableNumber: 3
        },
        {
          from: '2021-10-10T12:55:00',
          to: '2021-10-10T13:10:00',
          tableNumber: 4
        },
        {
          from: '2021-10-10T13:35:00',
          to: '2021-10-10T13:50:00',
          tableNumber: 3
        }
      ],
      total: 7
    })
  })

  it('should get empty when no available slots', async () => {
    const opening = new Date('2021-10-10T08:00:00')
    for (let i = 0; i <= 23; i++) {
      const time = new Date(opening.getTime() + 45 * 60_000 * i)
      await createReservation.execute(new CreateReservationCommand(reservationAt(time)))
      await createReservation.execute(new CreateReservationCommand(reservationAt(time)))
    }

    const response = await app.inject({
      method: 'GET',
      url: '/v1/availability',
      query: { date: '2021-10-10', partySize: '4' }
    })

    expect(JSON.parse(response.body)).toEqual({
      items: [],
      total: 0
    })
  })
})

function reservationAt(time: Date): Reservation {
  return Reservation.create(time, new CustomerDetails('John', 'john@test.com', '931111111'), 4)
}
