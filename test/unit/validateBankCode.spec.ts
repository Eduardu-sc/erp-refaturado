import { validateBankCode } from '@infra/database/validateBankCode.ts'

test.each(['', undefined, null, '1', '12', 'AAA', '1234'])(
  'deve retorna false se o code  %s for invalido',
  async (rawName: any) => {
    const isValidat = validateBankCode(rawName)
    expect(isValidat).toBe(false)
  },
)
test('deve retorna true se o code for valido', async () => {
  const code = '300'
  const isValidat = validateBankCode(code)
  expect(isValidat).toBe(true)
})
