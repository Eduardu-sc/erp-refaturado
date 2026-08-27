import { BankDAODataBase } from '@infra/database/bancoDao.ts'
import { RemoveBank } from '@infra/database/RemoveBank.ts'

let bankDao: BankDAODataBase
let stu: RemoveBank

beforeAll(() => {
  bankDao = new BankDAODataBase()
  stu = new RemoveBank(bankDao)
})

test('deve  deletar um banco (DELETE /banco)', async () => {
  const inputCreate = {
    codigo: '555',
    nome: 'teste',
    url: 'teste4.com.br',
  }
  const bankid = await bankDao.save(inputCreate)

  stu.execute({ id: bankid })
})
