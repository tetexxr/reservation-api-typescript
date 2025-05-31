import { describe, it, expect } from 'vitest'
import { Reservation } from '@/domain/reservations/Reservation'
import { CustomerDetails } from '@/domain/reservations/CustomerDetails'

describe('Reservation', () => {
  const reservation = Reservation.create(
    new Date('2021-10-10T10:00:00'),
    new CustomerDetails('John', 'john@test.com', '931111111'),
    4
  )

  it('should overlap with begin time', () => {
    const time = new Date('2021-10-10T09:30:00')
    expect(reservation.isOverlappingWith(time)).toBe(true)
  })

  it('should overlap with end time', () => {
    const time = new Date('2021-10-10T10:30:00')
    expect(reservation.isOverlappingWith(time)).toBe(true)
  })

  it('should not overlap and are earlier', () => {
    const time = new Date('2021-10-10T09:15:00')
    expect(reservation.isOverlappingWith(time)).toBe(false)
  })

  it('should not overlap and are later', () => {
    const time = new Date('2021-10-10T10:45:00')
    expect(reservation.isOverlappingWith(time)).toBe(false)
  })
})
