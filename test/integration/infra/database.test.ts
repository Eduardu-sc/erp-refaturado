import { BancoDAO } from '@infra/database/bancoDao.ts'
let bankDao: BancoDAO

beforeAll(() => {
  bankDao = new BancoDAO()
})
test('deve testar as integracao do banco', async () => {
  const outPutbank = {
    codigo: '001',
    nome: 'banco de integracao',
    url: 'teste.com.br',
  }
  const bankId = await bankDao.save(outPutbank) // salvar

  const lista = await bankDao.list() // teste listar
  const existe = lista.find((bankData) => bankData.id === bankId)
  expect(existe).toBeTruthy()
  expect(existe.codigo).toBe(outPutbank.codigo)
  expect(existe.nome).toBe(outPutbank.nome)
  expect(existe.url).toBe(outPutbank.url)

  const bankData = await bankDao.getbyid(existe.id) // buscar por id
  expect(bankData).toBeTruthy()
  expect(bankData.id).toBe(existe.id)
  expect(bankData.codigo).toBe(existe.codigo)
  expect(bankData.nome).toBe(existe.nome)
  expect(bankData.url).toBe(existe.url)

  const outPutUpdate = {
    id: bankData.id,
    codigo: '700',
    nome: 'novo teste',
    url: 'testenove.com.br',
  }
  const bankUpdate = await bankDao.update(outPutUpdate)
  expect(bankUpdate).toBeTruthy()
  expect(bankUpdate.id).toBe(bankData.id)
  expect(bankUpdate.codigo).toBe(outPutUpdate.codigo)
  expect(bankUpdate.nome).toBe(outPutUpdate.nome)
  expect(bankUpdate.url).toBe(outPutUpdate.url)

  await bankDao.remove(bankUpdate.id)
  const bankDelete = await bankDao.getbyid(bankUpdate.id)
  expect(bankDelete).toBeFalsy()
})
