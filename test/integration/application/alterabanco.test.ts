import { alteraBanco } from '@infra/database/alterarbanco.ts'
import { BancoDAO } from '@infra/database/bancoDao.ts'

test('deve  alterar um banco)', async () => {
  const bancoDao = new BancoDAO()

  const bankCreate = {
    codigo: '555',
    nome: 'teste',
    url: 'teste4.com.br',
  }
  const bankId = await bancoDao.save(bankCreate)

  const bankData = await bancoDao.getbyid(bankId)
  expect(bankData).toBeTruthy()
  expect(bankData.id).toBe(bankId)
  expect(bankData.codigo).toBe(bankCreate.codigo)
  expect(bankData.nome).toBe(bankCreate.nome)
  expect(bankData.url).toBe(bankCreate.url)

  const inputUpdate = {
    id: bankData.id,
    codigo: '700',
    nome: 'update 3',
    url: 'update.com.br',
  }
  const bankUpdate = await alteraBanco(inputUpdate)
  expect(bankUpdate).toBeTruthy()
  expect(bankUpdate.id).toBe(inputUpdate.id)
  expect(bankUpdate.codigo).toBe(inputUpdate.codigo)
  expect(bankUpdate.nome).toBe(inputUpdate.nome)
  expect(bankUpdate.url).toBe(inputUpdate.url)

  await bancoDao.remove(bankUpdate.id)
  const bankDelete = await bancoDao.getbyid(bankId)
  expect(bankDelete).toBeFalsy()
})
