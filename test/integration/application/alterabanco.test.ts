import { AlterarBanco } from '@infra/database/alterarbanco.ts'
import { BankDAODataBase } from '@infra/database/bancoDao.ts'
import Sinon from 'sinon'

import { BankDaoMemory } from '../../moks/bankDaoMemory.ts'
let bankDTO: BankDAODataBase
let alterarBanco: AlterarBanco
beforeAll(() => {
  bankDTO = new BankDaoMemory()
  // bankDTO = new BankDAODataBase()
  alterarBanco = new AlterarBanco(bankDTO)
})
test.only('deve  alterar um banco(use-case))', async () => {
  const bankCreate = {
    codigo: '555',
    nome: 'teste',
    url: 'teste4.com.br',
  }

  const bankId = await bankDTO.save(bankCreate)

  const bankData = await bankDTO.getById(bankId)

  expect(bankData).toBeTruthy()
  expect(bankData.id).toBe(bankId)
  expect(bankData.codigo).toBe(bankCreate.codigo)
  expect(bankData.nome).toBe(bankCreate.nome)
  expect(bankData.url).toBe(bankCreate.url)

  const inputUpdate = {
    id: bankData.id,
    codigo: '700',
    nome: 'update 3',
    url: 'update.com.br',
  }

  const bankUpdate = await alterarBanco.execute(inputUpdate)
  expect(bankUpdate).toBeTruthy()
  expect(bankUpdate.id).toBe(inputUpdate.id)
  expect(bankUpdate.codigo).toBe(inputUpdate.codigo)
  expect(bankUpdate.nome).toBe(inputUpdate.nome)
  expect(bankUpdate.url).toBe(inputUpdate.url)

  await bankDTO.remove(bankUpdate.id)

  const bankDelete = await bankDTO.getById(bankUpdate.id)
  expect(bankDelete).toBeFalsy()
  Sinon.restore()
})
