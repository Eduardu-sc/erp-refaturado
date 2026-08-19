import { getbyid, list, save } from '@infra/database/database.ts'

test('deve testar as integracao do banco', async () => {
  const outPutbank = {
    codigo: '001',
    nome: 'banco de integracao',
    url: 'teste.com.br',
  }
  const bankId = await save(outPutbank)

  const lista = await list()
  const existe = lista.find((bankData) => bankData.id === bankId)
  expect(existe).toBeTruthy()
  expect(existe.codigo).toBe(outPutbank.codigo)
  expect(existe.nome).toBe(outPutbank.nome)
  expect(existe.url).toBe(outPutbank.url)

  await getbyid(existe.id)
})
