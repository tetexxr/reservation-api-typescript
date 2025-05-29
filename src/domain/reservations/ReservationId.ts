import { v4 as uuidv4 } from 'uuid'

export class ReservationId {
  constructor(public readonly value: string) {}

  static new(): ReservationId {
    return new ReservationId(uuidv4())
  }
}
