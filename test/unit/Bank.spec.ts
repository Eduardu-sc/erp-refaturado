import { Bank } from '@infra/database/bank.ts'

test('Deve criar um banco', async () => {
  const input = { name: 'Any Nome', code: '123', url: 'url' }
  const instance = Bank.create(input)
  expect(instance).toBeTruthy()
  expect(instance.getBankId()).toBeDefined()
  expect(instance.getName()).toBe('Any Nome')
  expect(instance.getCode()).toBe('123')
  expect(instance.getUrl()).toBe('url')
})
test('Deve Restaurar um banco', async () => {
  const input = { name: 'Any Nome', code: '123', url: 'url', bankId: 1 }
  const instance = Bank.restore(input)
  expect(instance).toBeTruthy()
  expect(instance.getBankId()).toBe(1)
  expect(instance.getName()).toBe('Any Nome')
  expect(instance.getCode()).toBe('123')
  expect(instance.getUrl()).toBe('url')
})
test('Deve alterar propriedade do banco', async () => {
  const input = { name: 'Any Nome', code: '123', url: 'url', bankId: 1 }
  const instance = Bank.restore(input)

  instance.setCode('321')
  instance.setName('other name')
  instance.setUrl('other url')
  expect(instance).toBeTruthy()
  expect(instance.getBankId()).toBe(1)
  expect(instance.getCode()).toBe('321')
  expect(instance.getName()).toBe('other name')
  expect(instance.getUrl()).toBe('other url')
})
