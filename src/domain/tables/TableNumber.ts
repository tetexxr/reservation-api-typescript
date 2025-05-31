export class TableNumber {
  constructor(public readonly value: number) {}

  equals(other: TableNumber): boolean {
    return this.value === other.value
  }
}
