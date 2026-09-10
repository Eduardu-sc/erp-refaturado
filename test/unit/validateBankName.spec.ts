import { validateBankName } from '@infra/database/validateBankName.ts'

test.each(['', undefined, null, 'Test'])(
  'deve retorna false se o nome  %s for invalido',
  async (rawName: any) => {
    const isValidat = validateBankName(rawName)
    expect(isValidat).toBe(false)
  },
)
test('deve retorna true se o nome for valido', async () => {
  const name = 'Banco Valido'
  const isValidat = validateBankName(name)
  expect(isValidat).toBe(true)
})
