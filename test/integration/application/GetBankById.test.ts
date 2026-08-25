import { BankDAODataBase } from '@infra/database/bancoDao.ts'
import { GetBankById } from '@infra/database/GetBankById.ts'

let bancoDao: BankDAODataBase
let stu: GetBankById
beforeAll(() => {
  bancoDao = new BankDAODataBase()
  stu = new GetBankById(bancoDao)
})

test('deve retornar um banco (usecase)', async () => {
  const bankCreate = {
    codigo: '554',
    nome: 'teste teste',
    url: 'teste5.com.br',
  }
  const bankId = await bancoDao.save(bankCreate)
  const inputId = {
    id: bankId,
  }
  const outPut = await stu.execute(inputId)

  expect(outPut).toBeInstanceOf(Object)

  expect(outPut.id).toBe(bankId)
  expect(outPut.codigo).toBe(bankCreate.codigo)
  expect(outPut.nome).toBe(bankCreate.nome)
  expect(outPut.url).toBe(bankCreate.url)

  await bancoDao.remove(bankId)
})
