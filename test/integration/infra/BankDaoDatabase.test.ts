import { ApplicationError } from '@infra/database/ApplicationError.ts'
import { BankDAODataBase } from '@infra/database/bancoDao.ts'

let bankDao: BankDAODataBase

beforeAll(() => {
  bankDao = new BankDAODataBase()
})

test('deve salvar um banco', async () => {
  const outPutBank = {
    codigo: '001',
    nome: 'banco de integracao',
    url: 'teste.com.br',
  }

  const bankId = await bankDao.save(outPutBank)

  const bankData = await bankDao.getById(bankId)

  expect(bankData).toBeTruthy()
  expect(bankData?.id).toBe(bankId)
  expect(bankData?.codigo).toBe(outPutBank.codigo)
  expect(bankData?.nome).toBe(outPutBank.nome)
  expect(bankData?.url).toBe(outPutBank.url)

  await bankDao.remove(bankId)
})

test('deve listar os bancos', async () => {
  const outPutBank = {
    codigo: '002',
    nome: 'banco de listagem',
    url: 'listagem.com.br',
  }

  const bankId = await bankDao.save(outPutBank)

  const lista = await bankDao.list()

  const bankData = lista.find((bank) => bank.id === bankId)

  expect(bankData).toBeTruthy()
  expect(bankData?.id).toBe(bankId)
  expect(bankData?.codigo).toBe(outPutBank.codigo)
  expect(bankData?.nome).toBe(outPutBank.nome)
  expect(bankData?.url).toBe(outPutBank.url)

  await bankDao.remove(bankId)
})

test('deve buscar um banco por id', async () => {
  const outPutBank = {
    codigo: '003',
    nome: 'banco buscar id',
    url: 'buscar.com.br',
  }

  const bankId = await bankDao.save(outPutBank)

  const bankData = await bankDao.getById(bankId)

  expect(bankData).toBeTruthy()
  expect(bankData?.id).toBe(bankId)
  expect(bankData?.codigo).toBe(outPutBank.codigo)
  expect(bankData?.nome).toBe(outPutBank.nome)
  expect(bankData?.url).toBe(outPutBank.url)

  await bankDao.remove(bankId)
})

test('deve atualizar um banco', async () => {
  const outPutBank = {
    codigo: '004',
    nome: 'banco para atualizar',
    url: 'atualizar.com.br',
  }

  const bankId = await bankDao.save(outPutBank)

  const outPutUpdate = {
    id: bankId,
    codigo: '700',
    nome: 'novo teste',
    url: 'testenovo.com.br',
  }

  await bankDao.update(outPutUpdate)

  const bankUpdate = await bankDao.getById(bankId)

  expect(bankUpdate).toBeTruthy()
  expect(bankUpdate?.id).toBe(bankId)
  expect(bankUpdate?.codigo).toBe(outPutUpdate.codigo)
  expect(bankUpdate?.nome).toBe(outPutUpdate.nome)
  expect(bankUpdate?.url).toBe(outPutUpdate.url)

  await bankDao.remove(bankId)
})

test('deve remover um banco', async () => {
  const outPutBank = {
    codigo: '005',
    nome: 'banco para remover',
    url: 'remover.com.br',
  }

  const bankId = await bankDao.save(outPutBank)

  const bankData = await bankDao.getById(bankId)

  expect(bankData).toBeTruthy()

  await bankDao.remove(bankId)

  const bankDelete = await bankDao.getById(bankId)

  expect(bankDelete).toBeFalsy()
})

test('deve buscar um banco por codigo', async () => {
  const input = {
    codigo: crypto.randomUUID(),
    nome: 'banco buscar id',
    url: 'buscar.com.br',
  }

  const bankId = await bankDao.save(input)

  const bankData = await bankDao.getByCode(input.codigo)

  expect(bankData).toBeTruthy()
  expect(bankData?.id).toBe(bankId)
  expect(bankData?.codigo).toBe(input.codigo)
  expect(bankData?.nome).toBe(input.nome)
  expect(bankData?.url).toBe(input.url)

  await bankDao.remove(bankId)
})

test('deve buscar um banco por nome', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const fakeName = `name ${Math.random()}`
  const input = {
    codigo: fakeCode,
    nome: fakeName,
    url: 'buscar.com.br',
  }

  const bankId = await bankDao.save(input)

  const bankData = await bankDao.getByName(input.nome)

  expect(bankData).toBeTruthy()
  expect(bankData?.id).toBe(bankId)
  expect(bankData?.codigo).toBe(input.codigo)
  expect(bankData?.nome).toBe(input.nome)
  expect(bankData?.url).toBe(input.url)

  await bankDao.remove(bankId)
})

test('deve lançar um erro se Id nao for um numero ao remover', async () => {
  await expect(bankDao.remove('aaa' as any)).rejects.toThrow(
    new ApplicationError('ID do banco e invalido'),
  )
})

test('deve lançar um erro quando quando for Consultar por ID', async () => {
  await expect(bankDao.getById('aaa' as any)).rejects.toThrow(
    'ID do banco e invalido',
  )
})
