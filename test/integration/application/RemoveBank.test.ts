import { Bank } from '@infra/database/bank.ts'
import { BankRepository } from '@infra/database/bankRepository.ts'
import { RemoveBank } from '@infra/database/RemoveBank.ts'

import { BankRepositoryFake } from '../../moks/BankRepositoryFake.ts'

let bankRepository: BankRepository
let stu: RemoveBank

beforeAll(() => {
  bankRepository = new BankRepositoryFake()
  stu = new RemoveBank(bankRepository)
})

test('deve  deletar um banco (DELETE /banco)', async () => {
  const inputCreate = Bank.create({
    code: '555',
    name: 'teste',
    url: 'teste4.com.br',
  })
  const bankSaved = await bankRepository.save(inputCreate)

  stu.execute({ id: bankSaved.getBankId() })
})
