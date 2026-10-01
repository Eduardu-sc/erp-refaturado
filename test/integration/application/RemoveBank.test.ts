import { AdapterMysql } from '@infra/database/AdapterMysql.ts'
import { Bank } from '@infra/database/bank.ts'
import {
  BankRepository,
  BankRepositoryDataBase,
} from '@infra/database/bankRepository.ts'
import { DatabaseConnection } from '@infra/database/DataBaseConnetion.ts'
import { RemoveBank } from '@infra/database/RemoveBank.ts'

let bankRepository: BankRepository
let stu: RemoveBank
let dataBaseConnection: DatabaseConnection
beforeAll(() => {
  dataBaseConnection = new AdapterMysql(process.env.DATABASE_URL)
  bankRepository = new BankRepositoryDataBase(dataBaseConnection)
  stu = new RemoveBank(bankRepository)
})

test('deve  deletar um banco (DELETE /banco)', async () => {
  const inputCreate = Bank.create({
    code: '555',
    name: 'teste teste',
    url: 'teste4.com.br',
  })

  const bankSaved = await bankRepository.save(inputCreate)

  await stu.execute({ id: bankSaved.getBankId() })
})
