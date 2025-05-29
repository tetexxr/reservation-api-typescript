import { TableNumber } from '../tables/TableNumber'

export class AvailableSlot {
  constructor(
    private readonly from: Date,
    private readonly to: Date,
    private readonly partySize: number,
    private readonly tableNumber: TableNumber
  ) {}

  getFrom(): Date {
    return this.from
  }

  getTo(): Date {
    return this.to
  }

  getPartySize(): number {
    return this.partySize
  }

  getTableNumber(): TableNumber {
    return this.tableNumber
  }
}
