import { BankDAODataBase } from '@infra/database/bancoDao.ts'
import { CreateBank } from '@infra/database/CreateBank.ts'

let bancoDao: BankDAODataBase
let stu: CreateBank
beforeAll(() => {
  bancoDao = new BankDAODataBase()
  stu = new CreateBank(bancoDao)
})

test('deve  criar um banco (usecase)', async () => {
  const inputCreate = {
    codigo: '555',
    nome: 'teste',
    url: 'teste4.com.br',
  }
  const outPut = await stu.execute(inputCreate)

  expect(outPut).toBeTruthy()
  expect(outPut?.id).toBe(outPut.id)
  expect(outPut?.codigo).toBe(inputCreate.codigo)
  expect(outPut?.nome).toBe(inputCreate.nome)
  expect(outPut?.url).toBe(inputCreate.url)

  await bancoDao.remove(outPut.id)
})
