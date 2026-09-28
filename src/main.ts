import { ApplicationError } from '@infra/database/ApplicationError.ts'
import { BankRepositoryDataBase } from '@infra/database/bankRepository.ts'
import { CreateBank } from '@infra/database/CreateBank.ts'
import { DomainError } from '@infra/database/DomainError.ts'
import { GetBankById } from '@infra/database/GetBankById.ts'
import { GetBankList } from '@infra/database/GetBankList.ts'
import { NotFoundError } from '@infra/database/NotFoundError.ts'
import { RemoveBank } from '@infra/database/RemoveBank.ts'
import { UpdateBank } from '@infra/database/UpdateBank.ts'
import cors from 'cors'
import express, { Request, Response } from 'express'

const app = express()
app.use(express.json())
app.use(cors())

const bankRepository = new BankRepositoryDataBase()
app.get('/banco', async (request: Request, response: Response) => {
  const usecase = new GetBankList(bankRepository)
  const rows = await usecase.execute()
  response.status(200).json(rows)
})
app.get('/banco/:id', async (request: Request, response: Response) => {
  const bankId = Number(request.params.id)
  const usecase = new GetBankById(bankRepository)
  try {
    const rows = await usecase.execute({ id: bankId })
    response.status(200).json(rows)
  } catch (error: any) {
    if (error instanceof NotFoundError)
      return response.status(404).json({
        message: error.message,
        code: error.code,
      })
    return response.status(500).json({ message: 'Internal server Error' })
  }
})
app.post('/banco', async (request: Request, response: Response) => {
  const { codigo, nome, url } = request.body

  try {
    const usecase = new CreateBank(bankRepository)
    const outPut = await usecase.execute({ codigo, nome, url })

    return response.status(201).json(outPut)
  } catch (error: any) {
    if (error instanceof DomainError) {
      return response
        .status(422)
        .json({ message: error.message, code: error.code })
    }
    return response.status(500).json({ message: 'Internal server Error' })
  }
})
app.put('/banco/:id', async (request: Request, response: Response) => {
  const bankData = request.body
  const usecase = new UpdateBank(bankRepository)
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
    if (error instanceof NotFoundError) {
      return response
        .status(404)
        .json({ message: error.message, code: error.code })
    }
    if (error instanceof DomainError) {
      return response
        .status(422)
        .json({ message: error.message, code: error.code })
    }
    return response.status(500).json({ message: 'Internal server Error' })
  }
})
app.delete('/banco/:id', async (request: Request, response: Response) => {
  const bankId = Number(request.params.id)
  const usecase = new RemoveBank(bankRepository)
  const input = {
    id: bankId,
  }
  try {
    await usecase.execute(input)
    response.status(200).json()
  } catch (error) {
    if (error instanceof ApplicationError) {
      return response
        .status(422)
        .json({ message: error.message, code: error.code })
    }
    return response.status(500).json({ message: 'Internal server Error' })
  }
})
app.listen('3001', () => {
  console.log('http://localhost:3001')
})
