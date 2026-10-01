import { createPool, Pool } from 'mysql2/promise'

import { DatabaseConnection } from './DataBaseConnetion.ts'
export class AdapterMysql implements DatabaseConnection {
  private connection: Pool
  constructor(url: string | undefined) {
    this.connection = createPool(String(url))
  }

  async query(statement: string, params?: any[]): Promise<any> {
    const [rows] = await this.connection.query(statement, params)
    return rows
  }

  async close(): Promise<void> {
    this.connection.pool.end()
  }
}
