import { TableNumber } from './TableNumber'

export class Table {
  constructor(
    private readonly tableNumber: TableNumber,
    private readonly maximumSeatingCapacity: number
  ) {
    if (maximumSeatingCapacity <= 0) {
      throw new Error('Capacity must be greater than zero')
    }
  }

  getTableNumber(): TableNumber {
    return this.tableNumber
  }

  getMaximumSeatingCapacity(): number {
    return this.maximumSeatingCapacity
  }

  isSuitableForPartySize(partySize: number): boolean {
    return (
      (this.isOdd(partySize) && partySize + 1 === this.maximumSeatingCapacity) ||
      (!this.isOdd(partySize) && partySize === this.maximumSeatingCapacity)
    )
  }

  private isOdd(partySize: number): boolean {
    return partySize % 2 !== 0
  }
}
