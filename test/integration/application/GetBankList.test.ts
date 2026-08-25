import { BankDAODataBase } from '@infra/database/bancoDao.ts'
import { GetBankList } from '@infra/database/GetBankList.ts'

import { BankDaoFake } from '../../moks/BankDaoFake.ts'

let bankDao: BankDAODataBase
let stu: GetBankList

beforeAll(() => {
  bankDao = new BankDaoFake()
  stu = new GetBankList(bankDao)
})

test('deve retornar a lista de bancos (UseCase)', async () => {
  const bankCreate = {
    codigo: '554',
    nome: 'teste teste',
    url: 'teste5.com.br',
  }

  const bankId = await bankDao.save(bankCreate)
  const outPut = await stu.execute()
  expect(outPut.length).toBeGreaterThanOrEqual(1)
  const bancoData = outPut.find((item) => item.id === bankId)
  expect(bancoData).toBeTruthy()
  expect(bancoData.id).toBe(bankId)
  expect(bancoData.codigo).toBe(bankCreate.codigo)
  expect(bancoData.nome).toBe(bankCreate.nome)
  expect(bancoData.url).toBe(bankCreate.url)
  await bankDao.remove(bankId)
})
