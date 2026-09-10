import { Bank } from '@infra/database/bank.ts'
import {
  BankRepository,
  BankRepositoryDataBase,
} from '@infra/database/bankRepository.ts'
import { UpdateBank } from '@infra/database/UpdateBank.ts'

let bankRepository: BankRepository
let stu: UpdateBank
beforeAll(() => {
  bankRepository = new BankRepositoryDataBase()

  stu = new UpdateBank(bankRepository)
})
test('deve  alterar um banco(use-case))', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const fakeName = `name ${Math.random()}`
  const bankCreate = Bank.create({
    code: fakeCode,
    name: fakeName,
    url: 'teste4.com.br',
  })

  const bankSaved = await bankRepository.save(bankCreate)

  try {
    const bankData = await bankRepository.findById(bankSaved.getBankId())

    expect(bankData).toBeTruthy()
    expect(bankData?.getBankId()).toBe(bankData?.getBankId())
    expect(bankData?.getCode()).toBe(bankCreate.getCode())
    expect(bankData?.getName()).toBe(bankCreate.getName())
    expect(bankData?.getUrl()).toBe(bankCreate.getUrl())

    const fakeCodeUpdate = `${Math.random()}`.substring(2, 5)
    const fakeNameUpdate = `name ${Math.random()}`
    const inputUpdate = {
      id: bankSaved.getBankId(),
      codigo: fakeCodeUpdate,
      nome: fakeNameUpdate,
      url: 'update.com.br',
    }

    const bankUpdate = await stu.execute(inputUpdate)
    expect(bankUpdate).toBeTruthy()
    expect(bankUpdate?.id).toBe(inputUpdate.id)
    expect(bankUpdate?.codigo).toBe(inputUpdate.codigo)
    expect(bankUpdate?.nome).toBe(inputUpdate.nome)
    expect(bankUpdate?.url).toBe(inputUpdate.url)
  } finally {
    await bankRepository.remove(bankSaved.getBankId())

    const bankDelete = await bankRepository.findById(bankSaved.getBankId())
    expect(bankDelete).toBeFalsy()
  }
})
test('nao deve  alterar um banco com Nome invalido (usecase)', async () => {
  const invalidName = 'Test'
  const bankCreate = Bank.create({
    code: '555',
    name: 'Teste teste',
    url: 'teste4.com.br',
  })
  const bankSaved = await bankRepository.save(bankCreate)
  const inputUpdate = {
    id: bankSaved.getBankId(),
    codigo: '555',
    nome: invalidName,
    url: 'teste3.com.br',
  }
  try {
    await expect(stu.execute(inputUpdate)).rejects.toThrow('Nome invalido')
  } finally {
    await bankRepository.remove(bankSaved.getBankId())
  }
})
test('nao deve  alterar um banco com Codigo invalido (usecase)', async () => {
  const invalidCode = 'AAA'
  const bankCreate = Bank.create({
    code: '555',
    name: 'Teste teste',
    url: 'teste4.com.br',
  })
  const bankSaved = await bankRepository.save(bankCreate)

  const inputUpdate = {
    id: bankSaved.getBankId(),
    codigo: invalidCode,
    nome: 'teste teste',
    url: 'teste3.com.br',
  }
  try {
    await expect(stu.execute(inputUpdate)).rejects.toThrow('Codigo invalido')
  } finally {
    await bankRepository.remove(bankSaved.getBankId())
  }
})
test('nao deve alterar um banco inexistente', async () => {
  const inputUpdate = {
    id: 9_999_99,
    codigo: '555',
    nome: 'teste teste',
    url: 'teste3.com.br',
  }
  await expect(stu.execute(inputUpdate)).rejects.toThrow('Banco nao localizado')
})
test('nao deve alterar um banco para um CODIGO existente (use-case))', async () => {
  const firstBank = Bank.create({
    code: '553',
    name: 'teste',
    url: 'teste4.com.br',
  })
  const firstbankSaved = await bankRepository.save(firstBank)

  const secondBank = Bank.create({
    code: '554',
    name: 'teste name',
    url: 'teste4.com.br',
  })
  const secondBankSaved = await bankRepository.save(secondBank)

  const inputUpdate = {
    id: firstbankSaved.getBankId(),
    codigo: '554',
    nome: 'Test Name Changed',
    url: 'teste4.changed.com',
  }
  try {
    await expect(stu.execute(inputUpdate)).rejects.toThrow(
      'nao e possivel alterar o banco para um codigo ja existente',
    )
  } finally {
    await bankRepository.remove(firstbankSaved.getBankId())
    await bankRepository.remove(secondBankSaved.getBankId())
  }
})
test('nao deve alterar um banco para um NOME existente (use-case))', async () => {
  const firstBank = Bank.create({
    code: '553',
    name: 'teste',
    url: 'teste4.com.br',
  })
  const firstbankSaved = await bankRepository.save(firstBank)

  const secondBank = Bank.create({
    code: '554',
    name: 'teste name',
    url: 'teste4.com.br',
  })
  const secondBankSaved = await bankRepository.save(secondBank)

  const inputUpdate = {
    id: firstbankSaved.getBankId(),
    codigo: '555',
    nome: 'teste name',
    url: 'teste4.changed.com',
  }
  try {
    await expect(stu.execute(inputUpdate)).rejects.toThrow(
      'nao e possivel alterar o banco para um Nome ja existente',
    )
  } finally {
    await bankRepository.remove(firstbankSaved.getBankId())
    await bankRepository.remove(secondBankSaved.getBankId())
  }
})
