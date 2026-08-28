import { BankDaoFake } from '../../moks/BankDaoFake.ts'

let bankDao: BankDaoFake

beforeEach(() => {
  bankDao = new BankDaoFake()
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
    url: 'testenove.com.br',
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
