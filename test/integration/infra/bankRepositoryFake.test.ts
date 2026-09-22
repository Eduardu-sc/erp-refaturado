import { Bank } from '@infra/database/bank.ts'
import { BankRepository } from '@infra/database/bankRepository.ts'

import { BankRepositoryFake } from '../../moks/BankRepositoryFake.ts'

let bankRepository: BankRepository

beforeEach(() => {
  bankRepository = new BankRepositoryFake()
})
test('deve salvar um banco', async () => {
  const bank = Bank.create({
    code: '001',
    name: 'banco de integracao',
    url: 'teste.com.br',
  })

  const bankSave = await bankRepository.save(bank)
  const bankExiste = await bankRepository.findById(bankSave.getBankId())
  expect(bankSave).toBeTruthy()
  expect(bankSave?.getBankId()).toBe(bankExiste?.getBankId())
  expect(bankSave?.getCode()).toBe(bankExiste?.getCode())
  expect(bankSave?.getName()).toBe(bankExiste?.getName())
  expect(bankSave?.getUrl()).toBe(bankExiste?.getUrl())

  await bankRepository.remove(bankSave.getBankId())
})
test('deve listar os bancos', async () => {
  const bank = Bank.create({
    code: '002',
    name: 'banco de listagem',
    url: 'listagem.com.br',
  })

  const bankSave = await bankRepository.save(bank)

  const lista = await bankRepository.list()

  const bankData = lista.find(
    (bank) => bank.getBankId() === bankSave.getBankId(),
  )

  expect(bankData).toBeTruthy()
  expect(bankData?.getBankId()).toBe(bankSave?.getBankId())
  expect(bankData?.getCode()).toBe(bankSave?.getCode())
  expect(bankData?.getName()).toBe(bankSave?.getName())
  expect(bankData?.getUrl()).toBe(bankSave?.getUrl())

  await bankRepository.remove(bankSave.getBankId())
})
test('deve buscar um banco por id', async () => {
  const outPutBank = Bank.create({
    code: '003',
    name: 'banco buscar id',
    url: 'buscar.com.br',
  })

  const bankSave = await bankRepository.save(outPutBank)

  const bankData = await bankRepository.findById(bankSave.getBankId())

  expect(bankData).toBeTruthy()
  expect(bankData?.getBankId()).toBe(bankSave.getBankId())
  expect(bankData?.getCode()).toBe(bankSave.getCode())
  expect(bankData?.getName()).toBe(bankSave.getName())
  expect(bankData?.getUrl()).toBe(bankSave.getUrl())

  await bankRepository.remove(bankSave.getBankId())
})
test('deve atualizar um banco', async () => {
  const outPutBank = Bank.create({
    code: '004',
    name: 'banco para atualizar',
    url: 'atualizar.com.br',
  })

  const bankSaved = await bankRepository.save(outPutBank)

  bankSaved.changeCode('700')
  bankSaved.changeName('novo teste')
  bankSaved.setUrl('testenove.com.br')

  await bankRepository.update(bankSaved)

  const bankUpdate = await bankRepository.findById(bankSaved.getBankId())

  expect(bankUpdate).toBeTruthy()
  expect(bankUpdate?.getBankId()).toBe(bankSaved.getBankId())
  expect(bankUpdate?.getCode()).toBe('700')
  expect(bankUpdate?.getName()).toBe('novo teste')
  expect(bankUpdate?.getUrl()).toBe('testenove.com.br')

  await bankRepository.remove(bankSaved.getBankId())
})
test('deve remover um banco', async () => {
  const outPutBank = Bank.create({
    code: '005',
    name: 'banco para remover',
    url: 'remover.com.br',
  })
  const bankSaved = await bankRepository.save(outPutBank)
  const bankData = await bankRepository.findById(bankSaved.getBankId())
  expect(bankData).toBeTruthy()
  await bankRepository.remove(bankSaved.getBankId())
  const bankDelete = await bankRepository.findById(bankSaved.getBankId())
  expect(bankDelete).toBeFalsy()
})
test('deve buscar um banco por codigo', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const input = Bank.create({
    code: fakeCode,
    name: 'banco buscar id',
    url: 'buscar.com.br',
  })

  const bankSaved = await bankRepository.save(input)

  const bankData = await bankRepository.findByCode(bankSaved.getCode())

  expect(bankData).toBeTruthy()
  expect(bankData?.getBankId()).toBe(bankSaved.getBankId())
  expect(bankData?.getCode()).toBe(bankSaved.getCode())
  expect(bankData?.getName()).toBe(bankSaved.getName())
  expect(bankData?.getUrl()).toBe(bankSaved.getUrl())

  await bankRepository.remove(bankSaved.getBankId())
})
