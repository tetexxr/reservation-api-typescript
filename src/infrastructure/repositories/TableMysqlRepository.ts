import { injectable } from 'tsyringe'
import { db } from '../database/config'
import { Table } from '@/domain/tables/Table'
import { TableNumber } from '@/domain/tables/TableNumber'
import { TableRepository } from '@/domain/tables/TableRepository'

@injectable()
export class TableMysqlRepository implements TableRepository {
  async findAll(): Promise<Table[]> {
    const tables = await db.selectFrom('tables').selectAll().execute()
    return tables.map((table) => new Table(new TableNumber(table.number), table.maximumSeatingCapacity))
  }
}
