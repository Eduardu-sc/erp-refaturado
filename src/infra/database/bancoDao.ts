import mysqlConnection from 'mysql2/promise'

import { ApplicationError } from './ApplicationError.ts'

export interface BancoDao {
  save(dto: BankDao.SaveDto): Promise<number>
  list(): Promise<BankDao.BankDto[]>
  getById(id: number): Promise<BankDao.BankDto | undefined>
  update(dto: BankDao.UpdateDto): Promise<void>
  remove(id: number): Promise<void>
  getByCode(codigo: string): Promise<BankDao.BankDto | undefined>
  getByName(name: string): Promise<BankDao.BankDto | undefined>
}

export class BankDAODataBase implements BancoDao {
  async getByName(name: string): Promise<BankDao.BankDto | undefined> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )

    const [rows] = await connection.query<any[]>(
      `select * from banco where nome= ? LIMIT 1`,
      [name],
    )

    const bank = rows[0]

    connection.end()
    return bank
  }

  async getByCode(codigo: string): Promise<BankDao.BankDto | undefined> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )

    const [rows] = await connection.query<any[]>(
      `select * from banco where codigo= ? LIMIT 1`,
      [codigo],
    )

    const bank = rows[0]

    connection.end()
    return bank
  }

  async save(dto: BankDao.SaveDto): Promise<number> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [result] = await connection.query<any>(
      'INSERT INTO banco (codigo, nome,url) VALUES (?, ?, ?)  RETURNING *',
      [dto.codigo, dto.nome, dto.url],
    )
    connection.end()

    const [row] = result

    return row.id
  }

  async list(): Promise<BankDao.BankDto[]> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [rows] = await connection.query<any[]>(`select * from banco`, [])

    connection.end()
    return rows
  }

  async getById(id: number): Promise<BankDao.BankDto | undefined> {
    if (isNaN(id)) {
      throw new ApplicationError('ID do banco e invalido')
    }
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )

    const [rows] = await connection.query<any[]>(
      `select * from banco where id= ?`,
      [id],
    )

    const bank = rows[0]

    connection.end()
    return bank
  }

  async update(dto: BankDao.UpdateDto): Promise<void> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    await connection.execute(
      `UPDATE banco
       SET codigo = ?, nome = ?, url = ?
       WHERE id = ?`,
      [dto.codigo, dto.nome, dto.url, dto.id],
    )
    connection.end()
  }

  async remove(id: number): Promise<void> {
    if (isNaN(id)) throw new ApplicationError('ID do banco e invalido')

    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    await connection.query<any[]>(`delete from banco where id= ?`, [id])
    connection.end()
  }
}

export namespace BankDao {
  export type SaveDto = {
    codigo: string
    nome: string
    url: string
  }
  export type BankDto = {
    id: number
    codigo: string
    nome: string
    url: string
  }
  export type UpdateDto = {
    id: number
    codigo: string
    nome: string
    url: string
  }
}
