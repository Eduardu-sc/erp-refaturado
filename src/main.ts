import { AlterarBanco } from '@infra/database/alterarbanco.ts'
import { BancoDAO } from '@infra/database/bancoDao.ts'
import cors from 'cors'
import express, { Request, Response } from 'express'

const app = express()
app.use(express.json())
app.use(cors())
app.get('/banco', async (request: Request, response: Response) => {
  const bancoDao = new BancoDAO()
  const rows = await bancoDao.list()
  response.status(200).json(rows)
})
app.get('/banco/:id', async (request: Request, response: Response) => {
  const { id } = request.params
  const bancoDao = new BancoDAO()
  const rows = await bancoDao.getbyid(Number(id))

  if (!rows) {
    return response.status(404).json({
      message: 'Banco não encontrado',
    })
  }
  response.status(200).json(rows)
})
app.post('/banco', async (request: Request, response: Response) => {
  const { codigo, nome, url } = request.body
  const bancoDao = new BancoDAO()
  const id = await bancoDao.save({ codigo, nome, url })

  response.status(201).json({ id, codigo, nome, url })
})
app.put('/banco/:id', async (request: Request, response: Response) => {
  const banckDTO = new BancoDAO()
  const alterar = new AlterarBanco(banckDTO)
  const Bankid = request.params.id
  const bankData = request.body
  const input = {
    id: Number(Bankid),
    ...bankData,
  }
  const bankUpdate = await alterar.execute(input)

  response.status(200).json({
    ...bankUpdate,
  })
})
app.delete('/banco/:id', async (request: Request, response: Response) => {
  const { id } = request.params
  const bancoDao = new BancoDAO()
  await bancoDao.remove(Number(id))

  response.status(200).json()
})
app.listen('3001', () => {
  console.log('http://localhost:3001')
})
