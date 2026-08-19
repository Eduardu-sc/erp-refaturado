import {
  deleta,
  getbyid,
  list,
  save,
  update,
} from '@infra/database/database.ts'

test('deve testar as integracao do banco', async () => {
  const outPutbank = {
    codigo: '001',
    nome: 'banco de integracao',
    url: 'teste.com.br',
  }
  const bankId = await save(outPutbank) // salvar

  const lista = await list() // teste listar
  const existe = lista.find((bankData) => bankData.id === bankId)
  expect(existe).toBeTruthy()
  expect(existe.codigo).toBe(outPutbank.codigo)
  expect(existe.nome).toBe(outPutbank.nome)
  expect(existe.url).toBe(outPutbank.url)

  const bankData = await getbyid(existe.id) // buscar por id
  expect(bankData).toBeTruthy()
  expect(bankData.id).toBe(existe.id)
  expect(bankData.codigo).toBe(existe.codigo)
  expect(bankData.nome).toBe(existe.nome)
  expect(bankData.url).toBe(existe.url)

  const outPutUpdate = {
    codigo: '700',
    nome: 'novo teste',
    url: 'testenove.com.br',
  }
  const bankUpdate = await update(bankData.id, outPutUpdate)
  expect(bankUpdate).toBeTruthy()
  expect(bankUpdate.id).toBe(bankData.id)
  expect(bankUpdate.codigo).toBe(outPutUpdate.codigo)
  expect(bankUpdate.nome).toBe(outPutUpdate.nome)
  expect(bankUpdate.url).toBe(outPutUpdate.url)

  await deleta(bankUpdate.id)
  const bankDelete = await getbyid(bankUpdate.id)
  expect(bankDelete).toBeFalsy()
})
