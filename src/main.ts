import { BankDAODataBase } from '@infra/database/bancoDao.ts'
import { CreateBank } from '@infra/database/CreateBank.ts'
import { GetBankById } from '@infra/database/GetBankById.ts'
import { GetBankList } from '@infra/database/GetBankList.ts'
import { RemoveBank } from '@infra/database/RemoveBank.ts'
import { UpdateBank } from '@infra/database/UpdateBank.ts'
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
  const bankId = Number(request.params.id)
  const usecase = new GetBankById(bancoDao)
  const rows = await usecase.execute({ id: bankId })

  if (!rows) {
    return response.status(404).json({
      message: 'Banco não encontrado',
    })
  }
  response.status(200).json(rows)
})
app.post('/banco', async (request: Request, response: Response) => {
  const { codigo, nome, url } = request.body

  try {
    const usecase = new CreateBank(bancoDao)
    const outPut = await usecase.execute({ codigo, nome, url })

    return response.status(201).json(outPut)
  } catch (error: any) {
    return response.status(422).json({ message: error?.message })
  }
})
app.put('/banco/:id', async (request: Request, response: Response) => {
  const bankData = request.body
  const usecase = new UpdateBank(bancoDao)
  const Bankid = request.params.id
  try {
    const input = {
      id: Number(Bankid),
      ...bankData,
    }
    const bankUpdate = await usecase.execute(input)
    response.status(200).json({
      ...bankUpdate,
    })
  } catch (error: any) {
    if (error?.message === 'Banco nao localizado') {
      return response.status(404).json({ message: error?.message })
    }
    return response.status(422).json({ message: error?.message })
  }
})
app.delete('/banco/:id', async (request: Request, response: Response) => {
  const bankId = Number(request.params.id)
  const usecase = new RemoveBank(bancoDao)

  await usecase.execute({ id: bankId })

  response.status(200).json()
})
app.listen('3001', () => {
  console.log('http://localhost:3001')
})
