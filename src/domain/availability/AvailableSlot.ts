import { TableNumber } from '../tables/TableNumber'

export class AvailableSlot {
  constructor(
    public readonly from: Date,
    public readonly to: Date,
    public readonly partySize: number,
    public readonly tableNumber: TableNumber
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
