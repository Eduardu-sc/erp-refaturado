import { AdapterMysql } from '@infra/database/AdapterMysql.ts'
import { DatabaseConnection } from '@infra/database/DataBaseConnetion.ts'

let sut: DatabaseConnection
beforeAll(() => {
  sut = new AdapterMysql(process.env.DATABASE_URL)
})
afterAll(() => {
  sut.close()
})
test('deve consulta no banco com adpterMysql ', async () => {
  const [row] = await sut.query('select 1 as test')

  expect(row.test).toBe(1)
})

test('deve passar para o adpterMysql ', async () => {
  const [row] = await sut.query('select ? as test ', [1])

  expect(row.test).toBe(1)
})
