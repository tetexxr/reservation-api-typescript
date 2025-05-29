export class GetFreeTablesQuery {
  constructor(
    public readonly reservationTime: Date,
    public readonly partySize: number
  ) {}
}
