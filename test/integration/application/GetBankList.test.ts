import { Bank } from '@infra/database/bank.ts'
import {
  BankRepository,
  BankRepositoryDataBase,
} from '@infra/database/bankRepository.ts'
import { GetBankList } from '@infra/database/GetBankList.ts'

let stu: GetBankList
let bankRepository: BankRepository

beforeAll(() => {
  bankRepository = new BankRepositoryDataBase()
  stu = new GetBankList(bankRepository)
})

test('deve retornar a lista de bancos (UseCase)', async () => {
  const bankCreate = Bank.create({
    code: '554',
    name: 'teste teste',
    url: 'teste5.com.br',
  })

  const bankSaved = await bankRepository.save(bankCreate)

  try {
    const outPut = await stu.execute()
    expect(outPut.length).toBeGreaterThanOrEqual(1)
    const bancoData = outPut.find((item) => item.id === bankSaved.getBankId())
    expect(bancoData).toBeTruthy()
    expect(bancoData?.id).toBe(bankSaved.getBankId())
    expect(bancoData?.codigo).toBe(bankCreate.getCode())
    expect(bancoData?.nome).toBe(bankCreate.getName())
    expect(bancoData?.url).toBe(bankCreate.getUrl())
  } finally {
    await bankRepository.remove(bankSaved.getBankId())
  }
})
