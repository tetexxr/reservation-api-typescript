import { describe, it, expect } from 'vitest'
import { Table } from '@/domain/tables/Table'
import { TableNumber } from '@/domain/tables/TableNumber'

describe('Table', () => {
  const table = new Table(new TableNumber(1), 4)

  it('should be suitable when party size is even and matches maximum seating capacity', () => {
    const partySize = 4
    expect(table.isSuitableForPartySize(partySize)).toBe(true)
  })

  it('should be suitable when party size is odd and one less than maximum seating capacity', () => {
    const partySize = 3
    expect(table.isSuitableForPartySize(partySize)).toBe(true)
  })

  it('should not be suitable when party size is even and does not match maximum seating capacity', () => {
    const partySize = 6
    expect(table.isSuitableForPartySize(partySize)).toBe(false)
  })

  it('should not be suitable when party size is odd and not one less than maximum seating capacity', () => {
    const partySize = 1
    expect(table.isSuitableForPartySize(partySize)).toBe(false)
  })
})
