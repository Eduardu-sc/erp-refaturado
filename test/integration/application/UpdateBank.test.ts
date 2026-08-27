import { BankDAODataBase } from '@infra/database/bancoDao.ts'
import { UpdateBank } from '@infra/database/UpdateBank.ts'

import { BankDaoFake } from '../../moks/BankDaoFake.ts'
let bankDAO: BankDAODataBase
let stu: UpdateBank
beforeAll(() => {
  bankDAO = new BankDaoFake()
  // bankDTO = new BankDAODataBase()
  stu = new UpdateBank(bankDAO)
})
test('deve  alterar um banco(use-case))', async () => {
  const bankCreate = {
    codigo: '555',
    nome: 'teste',
    url: 'teste4.com.br',
  }

  const bankId = await bankDAO.save(bankCreate)

  const bankData = await bankDAO.getById(bankId)

  expect(bankData).toBeTruthy()
  expect(bankData?.id).toBe(bankId)
  expect(bankData?.codigo).toBe(bankCreate.codigo)
  expect(bankData?.nome).toBe(bankCreate.nome)
  expect(bankData?.url).toBe(bankCreate.url)

  const inputUpdate = {
    id: bankId,
    codigo: '700',
    nome: 'update 3',
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
test('nao deve  alterar um banco que nao existe (usecase)', async () => {
  const inputUpdate = {
    id: 9_999_99,
    codigo: '555',
    nome: 'teste teste',
    url: 'teste3.com.br',
  }
  await expect(stu.execute(inputUpdate)).rejects.toThrow('Banco nao localizado')
})
