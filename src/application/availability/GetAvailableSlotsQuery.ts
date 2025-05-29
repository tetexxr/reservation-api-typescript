export class GetAvailableSlotsQuery {
  constructor(
    public readonly date: Date,
    public readonly partySize: number
  ) {}
}
