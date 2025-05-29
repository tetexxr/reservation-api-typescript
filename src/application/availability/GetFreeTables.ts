import { ReservationRepository } from '@/domain/reservations/ReservationRepository'
import { ReservationTableRepository } from '@/domain/reservations/ReservationTableRepository'
import { Table } from '@/domain/tables/Table'
import { TableRepository } from '@/domain/tables/TableRepository'
import { GetFreeTablesQuery } from './GetFreeTablesQuery'

export class GetFreeTables {
  constructor(
    private readonly tableRepository: TableRepository,
    private readonly reservationRepository: ReservationRepository,
    private readonly reservationTableRepository: ReservationTableRepository
  ) {}

  async execute(query: GetFreeTablesQuery): Promise<Table[]> {
    const tables = await this.tableRepository.findAll()
    const overlappingReservations = (await this.reservationRepository.findAll())
      .filter((reservation) => reservation.isOverlappingWith(query.reservationTime))
      .map((reservation) => reservation.getId())
    const allReservationTables = await this.reservationTableRepository.findAll()
    const reservedTables = [...allReservationTables]
      .filter((entry) => overlappingReservations.includes(entry[0]))
      .map((entry) => entry[1])
    const freeTables = tables
      .filter((table) => !reservedTables.some((reservedTable) => reservedTable === table.getTableNumber()))
      .filter((table) => table.isSuitableForPartySize(query.partySize))
      .sort((a, b) => a.getTableNumber().value - b.getTableNumber().value)
    return freeTables
  }
}
