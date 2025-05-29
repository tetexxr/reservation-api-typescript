import { TableNumber } from '../tables/TableNumber'

export class AvailableSlot {
  constructor(
    private readonly startTime: Date,
    private readonly endTime: Date,
    private readonly partySize: number,
    private readonly tableNumber: TableNumber
  ) {}

  getStartTime(): Date {
    return this.startTime
  }

  getEndTime(): Date {
    return this.endTime
  }

  getPartySize(): number {
    return this.partySize
  }

  getTableNumber(): TableNumber {
    return this.tableNumber
  }
}
