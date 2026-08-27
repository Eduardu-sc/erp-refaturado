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
    nome: 'teste test',
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
test.each(['', undefined, null, 'Test'])(
  'Não deve  criar um banco nome invalido %s (usecase)',
  async (rawName: any) => {
    const inputCreate = {
      codigo: '555',
      nome: rawName,
      url: 'teste4.com.br',
    }
    await expect(stu.execute(inputCreate)).rejects.toThrow('Nome invalido')
  },
)
test.each(['', undefined, null, '1', '12', 'AAA'])(
  'Não deve  criar um banco codigo invalido %s (usecase)',
  async (invalidCode: any) => {
    const inputCreate = {
      codigo: invalidCode,
      nome: 'Test teste',
      url: 'teste4.com.br',
    }
    await expect(stu.execute(inputCreate)).rejects.toThrow('Codigo invalido')
  },
)
