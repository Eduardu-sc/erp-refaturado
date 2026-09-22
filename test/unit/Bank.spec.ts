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
  const input = { name: 'Any Nome', code: '123', url: 'url' }
  const instance = Bank.create(input)

  instance.changeCode('321')
  instance.changeName('other name')
  instance.setUrl('other url')
  expect(instance).toBeTruthy()
  expect(instance.getCode()).toBe('321')
  expect(instance.getName()).toBe('other name')
  expect(instance.getUrl()).toBe('other url')
})
test('Não deve criar um banco com nome inválido', () => {
  const invalidName = 'abc'
  expect(() =>
    Bank.create({
      name: invalidName,
      code: '123',
      url: 'url',
    }),
  ).toThrow('Nome invalido')
})
test('Não deve criar um banco com código inválido', () => {
  const invalidCode = 'abc'
  expect(() =>
    Bank.create({
      name: 'Banco Test',
      code: invalidCode,
      url: 'url',
    }),
  ).toThrow('Codigo invalido')
})
test('Não deve mudar o nome se ele for inválido', () => {
  const instancia = Bank.create({
    name: 'teste teste',
    code: '123',
    url: 'url',
  })
  const invalidName = 'abc'
  expect(() => instancia.changeName(invalidName)).toThrow('Nome invalido')
})
test('Não deve mudar o código se ele for inválido', () => {
  const instancia = Bank.create({
    name: 'Banco Test',
    code: '321',
    url: 'url',
  })
  const invalidCode = 'abc'
  expect(() => instancia.changeCode(invalidCode)).toThrow('Codigo invalido')
})
