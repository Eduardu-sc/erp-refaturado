import mysqlConnection, { ResultSetHeader, RowDataPacket } from 'mysql2/promise'

export const save = async (dto: any) => {
  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  const [result] = await connection.execute<ResultSetHeader>(
    'INSERT INTO banco (codigo, nome,url) VALUES (?, ?, ?)',
    [dto.codigo, dto.nome, dto.url],
  )
  connection.end()

  return result.insertId
}
export const list = async () => {
  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  const [rows] = await connection.query<any[]>(`select * from banco`, [])

  connection.end()
  return rows
}
export const getbyid = async (id: number) => {
  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )

  const [rows] = await connection.query<RowDataPacket[]>(
    `select * from banco where id= ?`,
    [id],
  )

  const bank = rows[0]

  connection.end()
  return bank
}
export const update = async (id: number, dto: any) => {
  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  await connection.execute<ResultSetHeader>(
    `UPDATE banco
     SET codigo = ?, nome = ?, url = ?
     WHERE id = ?`,
    [dto.codigo, dto.nome, dto.url, id],
  )
  connection.end()

  return { id, ...dto }
}
export const deleta = async (id: number) => {
  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  await connection.query<RowDataPacket[]>(`delete from banco where id= ?`, [id])
  connection.end()
}
