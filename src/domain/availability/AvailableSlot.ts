import { TableNumber } from '../tables/TableNumber'

export class AvailableSlot {
  constructor(
    public readonly from: Date,
    public readonly to: Date,
    public readonly partySize: number,
    public readonly tableNumber: TableNumber
  ) {}
}
