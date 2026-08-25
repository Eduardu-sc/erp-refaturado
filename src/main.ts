import { AlterarBanco } from '@infra/database/alterarbanco.ts'
import { BankDAODataBase } from '@infra/database/bancoDao.ts'
import { CreateBank } from '@infra/database/CreateBank.ts'
import { GetBankById } from '@infra/database/GetBankById.ts'
import { GetBankList } from '@infra/database/GetBankList.ts'
import cors from 'cors'
import express, { Request, Response } from 'express'

const app = express()
app.use(express.json())
app.use(cors())
const bancoDao = new BankDAODataBase()
app.get('/banco', async (request: Request, response: Response) => {
  const usecase = new GetBankList(bancoDao)
  const rows = await usecase.execute()
  response.status(200).json(rows)
})
app.get('/banco/:id', async (request: Request, response: Response) => {
  const { id } = request.params
  const usecase = new GetBankById(bancoDao)
  const inputID = { id }
  const rows = await usecase.execute(inputID)
  if (!rows) {
    return response.status(404).json({
      message: 'Banco não encontrado',
    })
  }
  response.status(200).json(rows)
})
app.post('/banco', async (request: Request, response: Response) => {
  const { codigo, nome, url } = request.body
  const usecase = new CreateBank(bancoDao)
  const id = await usecase.execute({ codigo, nome, url })

  response.status(201).json({ id, codigo, nome, url })
})
app.put('/banco/:id', async (request: Request, response: Response) => {
  const usecase = new AlterarBanco(bancoDao)
  const Bankid = request.params.id
  const bankData = request.body
  const input = {
    id: Number(Bankid),
    ...bankData,
  }
  const bankUpdate = await usecase.execute(input)

  response.status(200).json({
    ...bankUpdate,
  })
})
app.delete('/banco/:id', async (request: Request, response: Response) => {
  const { id } = request.params

  await bancoDao.remove(Number(id))

  response.status(200).json()
})
app.listen('3001', () => {
  console.log('http://localhost:3001')
})
