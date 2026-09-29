import mysqlConnection from 'mysql2/promise'

import { ApplicationError } from './ApplicationError.ts'
import { Bank } from './bank.ts'
export interface BankRepository {
  save(bank: Bank): Promise<Bank>
  list(): Promise<Bank[]>
  findById(id: number): Promise<Bank | undefined>
  update(dto: Bank): Promise<void>
  remove(id: number): Promise<void>
  findByCode(codigo: string): Promise<Bank | undefined>
  findByName(name: string): Promise<Bank | undefined>
}

export class BankRepositoryDataBase implements BankRepository {
  async findByName(name: string): Promise<Bank | undefined> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )

    const [rows] = await connection.query<any[]>(
      `select * from banco where nome= ? LIMIT  1`,
      [name],
    )
    if (rows.length === 0) {
      return undefined
    }
    const bank = Bank.restore({
      code: rows[0].codigo,
      name: rows[0].nome,
      url: rows[0].url,
      bankId: rows[0].id,
    })

    connection.end()
    return bank
  }

  async findByCode(codigo: string): Promise<Bank | undefined> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )

    const [rows] = await connection.query<any[]>(
      `select * from banco where codigo= ? LIMIT 1`,
      [codigo],
    )

    if (rows.length === 0) {
      return undefined
    }
    const bank = Bank.restore({
      code: rows[0].codigo,
      name: rows[0].nome,
      url: rows[0].url,
      bankId: rows[0].id,
    })
    connection.end()
    return bank
  }

  async save(bank: Bank): Promise<Bank> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [rows] = await connection.query<any>(
      'INSERT INTO banco (codigo, nome,url) VALUES (?, ?, ?) RETURNING *',
      [bank.getCode(), bank.getName(), bank.getUrl()],
    )

    connection.end()
    const [row] = rows

    const bankSaved = Bank.restore({
      bankId: row.id,
      code: bank.getCode(),
      name: bank.getName(),
      url: bank.getUrl(),
    })
    return bankSaved
  }

  async list(): Promise<Bank[]> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [rows] = await connection.query<any[]>(`select * from banco`, [])
    const banklist: Bank[] = []

    for (const row of rows) {
      const bank = Bank.restore({
        code: row.codigo,
        name: row.nome,
        url: row.url,
        bankId: row.id,
      })
      banklist.push(bank)
    }

    connection.end()
    return banklist
  }

  async findById(id: number): Promise<Bank | undefined> {
    if (isNaN(id)) {
      throw new Error('ID do banco e invalido')
    }
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )

    const [rows] = await connection.query<any[]>(
      `select * from banco where id= ? limit 1`,
      [id],
    )

    if (rows.length === 0) {
      return undefined
    }
    const bank = Bank.restore({
      code: rows[0].codigo,
      name: rows[0].nome,
      url: rows[0].url,
      bankId: rows[0].id,
    })
    connection.end()
    return bank
  }

  async update(bank: Bank): Promise<void> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    await connection.execute(
      `UPDATE banco
       SET codigo = ?, nome = ?, url = ?
       WHERE id = ?`,
      [bank.getCode(), bank.getName(), bank.getUrl(), bank.getBankId()],
    )
    connection.end()
  }

  async remove(id: number): Promise<void> {
    if (isNaN(id)) {
      throw new ApplicationError('ID do banco e invalido')
    }
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    await connection.query<any[]>(`delete from banco where id= ?`, [id])
    connection.end()
  }
}
