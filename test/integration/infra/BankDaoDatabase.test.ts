import { BankDAODataBase } from '@infra/database/bancoDao.ts'
let bankDao: BankDAODataBase

beforeAll(() => {
  bankDao = new BankDAODataBase()
})
test('deve testar as integracao do banco Dao', async () => {
  const outPutbank = {
    codigo: '001',
    nome: 'banco de integracao',
    url: 'teste.com.br',
  }
  const bankId = await bankDao.save(outPutbank) // salvar

  const lista = await bankDao.list() // teste listar
  const existe = lista.find((bankData) => bankData.id === bankId)
  expect(existe).toBeTruthy()
  expect(existe?.codigo).toBe(outPutbank.codigo)
  expect(existe?.nome).toBe(outPutbank.nome)
  expect(existe?.url).toBe(outPutbank.url)

  const bankData = await bankDao.getById(bankId) // buscar por id
  expect(bankData).toBeTruthy()
  expect(bankData?.id).toBe(existe?.id)
  expect(bankData?.codigo).toBe(existe?.codigo)
  expect(bankData?.nome).toBe(existe?.nome)
  expect(bankData?.url).toBe(existe?.url)

  const outPutUpdate = {
    id: bankId,
    codigo: '700',
    nome: 'novo teste',
    url: 'testenove.com.br',
  }
  await bankDao.update(outPutUpdate)
  const bankUpdate = await bankDao.getById(outPutUpdate.id)
  expect(bankUpdate).toBeTruthy()
  expect(bankUpdate?.id).toBe(bankData?.id)
  expect(bankUpdate?.codigo).toBe(outPutUpdate.codigo)
  expect(bankUpdate?.nome).toBe(outPutUpdate.nome)
  expect(bankUpdate?.url).toBe(outPutUpdate.url)

  await bankDao.remove(bankId)
  const bankDelete = await bankDao.getById(bankId)
  expect(bankDelete).toBeFalsy()
})
