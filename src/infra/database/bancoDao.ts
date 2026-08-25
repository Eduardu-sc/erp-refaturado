import mysqlConnection from 'mysql2/promise'

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
export interface BancoDao {
  save(dto: BankDao.SaveDto): Promise<number>
  list(): Promise<BankDao.BankDto[]>
  getById(id: number): Promise<BankDao.BankDto | undefined>
  update(dto: BankDao.UpdateDto): Promise<void>
  remove(id: number): Promise<void>
}

export class BankDAODataBase implements BancoDao {
  async save(dto: BankDao.SaveDto): Promise<number> {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [result] = await connection.execute<any>(
      'INSERT INTO banco (codigo, nome,url) VALUES (?, ?, ?)',
      [dto.codigo, dto.nome, dto.url],
    )
    connection.end()

    return result.insertId
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
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    await connection.query<any[]>(`delete from banco where id= ?`, [id])
    connection.end()
  }
}
