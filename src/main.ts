import cors from 'cors'
import express, { Request, Response } from 'express'
import mysqlConnection, { ResultSetHeader, RowDataPacket } from 'mysql2/promise'

const app = express()
app.use(express.json())
app.use(cors())
app.get('/banco', async (request: Request, response: Response) => {
  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  const [rows] = await connection.query(`select * from banco`, [])

  response.status(200).json(rows)
})
app.get('/banco/:id', async (request: Request, response: Response) => {
  const { id } = request.params
  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  const [rows] = await connection.query<RowDataPacket[]>(
    `select * from banco where id= ?`,
    [id],
  )
  const bank = rows[0]

  if (!bank) {
    return response.status(404).json({
      message: 'Banco não encontrado',
    })
  }
  response.status(200).json(bank)
})
app.post('/banco', async (request: Request, response: Response) => {
  const { codigo, nome, url } = request.body

  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  const [result] = await connection.execute<ResultSetHeader>(
    'INSERT INTO banco (codigo, nome,url) VALUES (?, ?, ?)',
    [codigo, nome, url],
  )
  response.status(201).json({ id: result.insertId, codigo, nome, url })
})
app.put('/banco/:id', async (request: Request, response: Response) => {
  const { id } = request.params
  const { codigo, nome, url } = request.body

  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  await connection.execute<ResultSetHeader>(
    `UPDATE banco
     SET codigo = ?, nome = ?, url = ?
     WHERE id = ?`,
    [codigo, nome, url, id],
  )
  response.status(200).json({
    id: Number(id),
    codigo,
    nome,
    url,
  })
})
app.delete('/banco/:id', async (request: Request, response: Response) => {
  const { id } = request.params
  const connection = mysqlConnection.createPool(
    String(process.env.DATABASE_URL),
  )
  await connection.query<RowDataPacket[]>(`delete from banco where id= ?`, [id])

  response.status(200).json()
})
app.listen('3001', () => {
  console.log('http://localhost:3001')
})
