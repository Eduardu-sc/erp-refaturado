import { AlterarBanco } from '@infra/database/alterarbanco.ts'
import { BancoDAO } from '@infra/database/bancoDao.ts'
import Sinon from 'sinon'
let bankDTO: BancoDAO
let alterarBanco: AlterarBanco
beforeAll(() => {
  bankDTO = new BancoDAO()
  alterarBanco = new AlterarBanco(bankDTO)
})
test.only('deve  alterar um banco(use-case))', async () => {
  const bankCreate = {
    codigo: '555',
    nome: 'teste',
    url: 'teste4.com.br',
  }
  const BankIdTest = 1
  Sinon.stub(BancoDAO.prototype, 'save').resolves(BankIdTest)
  const bankId = await bankDTO.save(bankCreate)

  const getByIdStub = Sinon.stub(BancoDAO.prototype, 'getbyid').resolves({
    id: BankIdTest,
    codigo: bankCreate.codigo,
    nome: bankCreate.nome,
    url: bankCreate.url,
  })
  const bankData = await bankDTO.getbyid(bankId)

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

  Sinon.stub(BancoDAO.prototype, 'update').resolves(inputUpdate)
  const bankUpdate = await alterarBanco.execute(inputUpdate)
  expect(bankUpdate).toBeTruthy()
  expect(bankUpdate.id).toBe(inputUpdate.id)
  expect(bankUpdate.codigo).toBe(inputUpdate.codigo)
  expect(bankUpdate.nome).toBe(inputUpdate.nome)
  expect(bankUpdate.url).toBe(inputUpdate.url)

  Sinon.stub(BancoDAO.prototype, 'remove').resolves()
  await bankDTO.remove(bankUpdate.id)

  getByIdStub.resolves(undefined)
  const bankDelete = await bankDTO.getbyid(bankUpdate.id)
  expect(bankDelete).toBeFalsy()
  Sinon.restore()
})
