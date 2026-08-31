import { BancoDao } from '@infra/database/bancoDao.ts'
import { UpdateBank } from '@infra/database/UpdateBank.ts'

import { BankDaoFake } from '../../moks/BankDaoFake.ts'
let bankDAO: BancoDao
let stu: UpdateBank
beforeAll(() => {
  bankDAO = new BankDaoFake()

  stu = new UpdateBank(bankDAO)
})
test('deve  alterar um banco(use-case))', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const fakeName = `name ${Math.random()}`
  const bankCreate = {
    codigo: fakeCode,
    nome: fakeName,
    url: 'teste4.com.br',
  }

  const bankId = await bankDAO.save(bankCreate)

  const bankData = await bankDAO.getById(bankId)

  expect(bankData).toBeTruthy()
  expect(bankData?.id).toBe(bankId)
  expect(bankData?.codigo).toBe(bankCreate.codigo)
  expect(bankData?.nome).toBe(bankCreate.nome)
  expect(bankData?.url).toBe(bankCreate.url)

  const fakeCodeUpdate = `${Math.random()}`.substring(2, 5)
  const fakeNameUpdate = `name ${Math.random()}`
  const inputUpdate = {
    id: bankId,
    codigo: fakeCodeUpdate,
    nome: fakeNameUpdate,
    url: 'update.com.br',
  }

  const bankUpdate = await stu.execute(inputUpdate)
  expect(bankUpdate).toBeTruthy()
  expect(bankUpdate?.id).toBe(inputUpdate.id)
  expect(bankUpdate?.codigo).toBe(inputUpdate.codigo)
  expect(bankUpdate?.nome).toBe(inputUpdate.nome)
  expect(bankUpdate?.url).toBe(inputUpdate.url)

  await bankDAO.remove(bankId)

  const bankDelete = await bankDAO.getById(bankId)
  expect(bankDelete).toBeFalsy()
})
test.each(['', undefined, null, 'Test'])(
  'nao deve  alterar um banco com Nome invalido (usecase)',
  async (rawName: any) => {
    const bankCreate = {
      codigo: '555',
      nome: 'Teste teste',
      url: 'teste4.com.br',
    }
    const bankId = await bankDAO.save(bankCreate)
    const inputUpdate = {
      id: bankId,
      codigo: '555',
      nome: rawName,
      url: 'teste3.com.br',
    }
    await expect(stu.execute(inputUpdate)).rejects.toThrow('Nome invalido')

    await bankDAO.remove(bankId)
  },
)
test.each(['', undefined, null, '1', '12', 'AAA'])(
  'nao deve  alterar um banco com Codigo invalido (usecase)',
  async (invalidCode: any) => {
    const bankCreate = {
      codigo: '555',
      nome: 'Teste teste',
      url: 'teste4.com.br',
    }
    const bankId = await bankDAO.save(bankCreate)

    const inputUpdate = {
      id: bankId,
      codigo: invalidCode,
      nome: 'teste teste',
      url: 'teste3.com.br',
    }
    await expect(stu.execute(inputUpdate)).rejects.toThrow('Codigo invalido')

    await bankDAO.remove(bankId)
  },
)
test('nao deve alterar um banco inexistente', async () => {
  const inputUpdate = {
    id: 9_999_99,
    codigo: '555',
    nome: 'teste teste',
    url: 'teste3.com.br',
  }
  await expect(stu.execute(inputUpdate)).rejects.toThrow('Banco nao localizado')
})
test('nao deve alterar um banco para um CODIGO existente (use-case))', async () => {
  const firstBank = {
    codigo: '553',
    nome: 'teste',
    url: 'teste4.com.br',
  }
  const firstbankId = await bankDAO.save(firstBank)

  const secondBank = {
    codigo: '554',
    nome: 'teste name',
    url: 'teste4.com.br',
  }
  const secondBankId = await bankDAO.save(secondBank)

  const inputUpdate = {
    id: firstbankId,
    codigo: '554',
    nome: 'Test Name Changed',
    url: 'teste4.changed.com',
  }

  await expect(stu.execute(inputUpdate)).rejects.toThrow(
    'nao e possivel alterar o banco para um codigo ja existente',
  )
  await bankDAO.remove(firstbankId)
  await bankDAO.remove(secondBankId)
})
