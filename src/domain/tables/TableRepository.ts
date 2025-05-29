import { Table } from './Table'

export interface TableRepository {
  findAll(): Promise<Table[]>
}
