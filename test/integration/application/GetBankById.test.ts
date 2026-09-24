import { Bank } from '@infra/database/bank.ts'
import {
  BankRepository,
  BankRepositoryDataBase,
} from '@infra/database/bankRepository.ts'
import { GetBankById } from '@infra/database/GetBankById.ts'
import { NotFoundError } from '@infra/database/NotFoundError.ts'

let stu: GetBankById
let bankRepository: BankRepository
beforeAll(() => {
  bankRepository = new BankRepositoryDataBase()

  stu = new GetBankById(bankRepository)
})

test('deve retornar um banco por id (usecase)', async () => {
  const bankCreate = Bank.create({
    code: '554',
    name: 'teste teste',
    url: 'teste5.com.br',
  })
  const bankSaved = await bankRepository.save(bankCreate)
  const inputId = {
    id: bankSaved.getBankId(),
  }
  try {
    const outPut = await stu.execute(inputId)

    expect(outPut).toBeInstanceOf(Object)

    expect(outPut?.id).toBe(bankSaved.getBankId())
    expect(outPut?.codigo).toBe(bankCreate.getCode())
    expect(outPut?.nome).toBe(bankCreate.getName())
    expect(outPut?.url).toBe(bankCreate.getUrl())
  } finally {
    await bankRepository.remove(bankSaved.getBankId())
  }
})
test('deve retornar um erro quando nao for encontrado (usecase)', async () => {
  const inputId = {
    id: 1_001_2,
  }

  await expect(stu.execute(inputId)).rejects.toThrow(
    new NotFoundError('Banco nao localizado'),
  )
})
