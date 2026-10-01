import { AdapterMysql } from '@infra/database/AdapterMysql.ts'
import { ApplicationError } from '@infra/database/ApplicationError.ts'
import { Bank } from '@infra/database/bank.ts'
import {
  BankRepository,
  BankRepositoryDataBase,
} from '@infra/database/bankRepository.ts'
import { CreateBank } from '@infra/database/CreateBank.ts'
import { DatabaseConnection } from '@infra/database/DataBaseConnetion.ts'

let stu: CreateBank
let bankRepository: BankRepository

let dataBaseConnection: DatabaseConnection
beforeAll(() => {
  dataBaseConnection = new AdapterMysql(process.env.DATABASE_URL)
  bankRepository = new BankRepositoryDataBase(dataBaseConnection)
  stu = new CreateBank(bankRepository)
})
test.only('deve  criar um banco (usecase)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const inputCreate = {
    codigo: fakeCode,
    nome: 'teste test',
    url: 'teste4.com.br',
  }
  const outPut = await stu.execute(inputCreate)
  console.log(outPut)
  expect(outPut).toBeTruthy()
  expect(outPut?.id).toBe(outPut.id)
  expect(outPut?.codigo).toBe(inputCreate.codigo)
  expect(outPut?.nome).toBe(inputCreate.nome)
  expect(outPut?.url).toBe(inputCreate.url)

  await bankRepository.remove(outPut.id)
})
test('Não deve  criar um banco nome invalido  (usecase)', async () => {
  const invalidName = 'Test'
  const inputCreate = {
    codigo: '555',
    nome: invalidName,
    url: 'teste4.com.br',
  }
  await expect(stu.execute(inputCreate)).rejects.toThrow('Nome invalido')
})
test('Não deve  criar um banco codigo invalido  (usecase)', async () => {
  const invalidCode = 'AAA'
  const inputCreate = {
    codigo: invalidCode,
    nome: 'Test teste',
    url: 'teste4.com.br',
  }
  await expect(stu.execute(inputCreate)).rejects.toThrow('Codigo invalido')
})
test('Não deve  criar um banco com CODIGO existente (usecase)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)

  const inputCreate = Bank.create({
    code: fakeCode,
    name: 'teste test',
    url: 'teste4.com.br',
  })

  const bankSaved = await bankRepository.save(inputCreate)
  try {
    const inputCreate2 = {
      codigo: fakeCode,
      nome: 'teste test',
      url: 'teste4.com.br',
    }

    await expect(stu.execute(inputCreate2)).rejects.toThrow(
      new ApplicationError('Codigo Banco ja existe'),
    )
  } finally {
    await bankRepository.remove(bankSaved.getBankId())
  }
})
test('Não deve  criar um banco com NOME existente (usecase)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const fakeName = `name ${Math.random()}`
  const inputCreate = Bank.create({
    code: fakeCode,
    name: fakeName,
    url: 'teste4.com.br',
  })

  const bankSaved = await bankRepository.save(inputCreate)
  try {
    const fakeCode2 = `${Math.random()}`.substring(2, 5)
    const inputCreate2 = {
      codigo: fakeCode2,
      nome: fakeName,
      url: 'teste4.com.br',
    }

    await expect(stu.execute(inputCreate2)).rejects.toThrow(
      new ApplicationError('Nome Banco ja existe'),
    )
  } finally {
    await bankRepository.remove(bankSaved.getBankId())
  }
})
