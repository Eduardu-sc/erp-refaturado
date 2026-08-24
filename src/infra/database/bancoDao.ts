import mysqlConnection from 'mysql2/promise'

export interface BancoDao {
  save(dto: any): Promise<number>
  list(): Promise<any[]>
  getById(id: number): Promise<any>
  update(dto: any): Promise<void>
  remove(id: number): Promise<void>
}

export class BankDAODataBase implements BancoDao {
  async save(dto: any) {
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

  async list() {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    const [rows] = await connection.query<any[]>(`select * from banco`, [])

    connection.end()
    return rows
  }

  async getById(id: number) {
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

  async update(dto: any) {
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

  async remove(id: number) {
    const connection = mysqlConnection.createPool(
      String(process.env.DATABASE_URL),
    )
    await connection.query<any[]>(`delete from banco where id= ?`, [id])
    connection.end()
  }
}
