import axios from 'axios'
import mysqlConnection from 'mysql2/promise'
axios.defaults.validateStatus = () => true
const url = 'http://localhost:3001'

const connection = mysqlConnection.createPool(String(process.env.DATABASE_URL))
afterAll(() => {
  connection.pool.end()
})

test('deve retornar a lista de bancos (GET /Banco)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const fakeName = `name ${Math.random()}`
  await connection.query(`delete from banco where codigo= ? or nome= ?`, [
    fakeCode,
    fakeName,
  ])
  const bankCreate = {
    codigo: fakeCode,
    nome: fakeName,
    url: 'teste5.com.br',
  }
  const responseCreate = await axios.post(`${url}/banco`, bankCreate)
  const outPutCreate = await responseCreate.data
  const bankId = outPutCreate.id

  const response = await axios.get(`${url}/banco`)
  const outPut = await response.data
  expect(response.status).toBe(200)
  expect(outPut).toBeInstanceOf(Array)
  expect(outPut.length).toBeGreaterThanOrEqual(1)

  const bancoData = outPut.find((item) => item.id === bankId)
  expect(bancoData).toBeTruthy()
  expect(bancoData.id).toBe(bankId)
  expect(bancoData.codigo).toBe(bankCreate.codigo)
  expect(bancoData.nome).toBe(bankCreate.nome)
  expect(bancoData.url).toBe(bankCreate.url)
  const responseDelete = await axios.delete(`${url}/banco/${bankId}`)
  expect(responseDelete.status).toBe(200)
})
test('deve retornar um banco (GET /Banco/1)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const fakeName = `name ${Math.random()}`
  await connection.query(`delete from banco where codigo= ? or nome= ?`, [
    fakeCode,
    fakeName,
  ])
  const bankCreate = {
    codigo: fakeCode,
    nome: fakeName,
    url: 'teste5.com.br',
  }
  const responseCreate = await axios.post(`${url}/banco`, bankCreate)
  const outPutCreate = await responseCreate.data
  const bankId = outPutCreate.id

  const response = await axios.get(`${url}/banco/${bankId}`)
  const outPut = await response.data

  expect(response.status).toBe(200)

  expect(outPut).toBeInstanceOf(Object)

  expect(outPut.id).toBe(bankId)
  expect(outPut.codigo).toBe(outPutCreate.codigo)
  expect(outPut.nome).toBe(outPutCreate.nome)
  expect(outPut.url).toBe(outPutCreate.url)

  const responseDelete = await axios.delete(`${url}/banco/${bankId}`)
  expect(responseDelete.status).toBe(200)
})
test('deve  criar um banco (POST /banco)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const fakeName = `name ${Math.random()}`
  const inputCreate = {
    codigo: fakeCode,
    nome: fakeName,
    url: 'teste4.com.br',
  }
  const responseCreate = await axios.post(`${url}/banco`, inputCreate)
  const outPutCreate = await responseCreate.data

  expect(responseCreate.status).toBe(201)

  const responseBank = await axios.get(`${url}/banco/${outPutCreate.id}`)
  const bankData = responseBank.data

  expect(bankData).toBeTruthy()
  expect(bankData.id).toBe(outPutCreate.id)
  expect(bankData.codigo).toBe(outPutCreate.codigo)
  expect(bankData.nome).toBe(outPutCreate.nome)
  expect(bankData.url).toBe(outPutCreate.url)

  const responseDelete = await axios.delete(`${url}/banco/${bankData.id}`)
  expect(responseDelete.status).toBe(200)
})
test.each(['Test'])(
  'Não deve  criar um banco nome invalido %s (POST /banco)',
  async (rawName: any) => {
    const fakeCode = `${Math.random()}`.substring(2, 5)

    const inputCreate = {
      codigo: fakeCode,
      nome: rawName,
      url: 'teste4.com.br',
    }
    const responseCreate = await axios.post(`${url}/banco`, inputCreate)
    expect(responseCreate.status).toBe(422)
    const outPutCreate = await responseCreate.data

    expect(outPutCreate.message).toBe('Nome invalido')
  },
)
test('deve  alterar um banco (PUT /banco)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const fakeName = `name ${Math.random()}`
  await connection.query(`delete from banco where codigo= ? or nome= ?`, [
    fakeCode,
    fakeName,
  ])
  const bankCreate = {
    codigo: fakeCode,
    nome: fakeName,
    url: 'teste4.com.br',
  }
  const responseCreate = await axios.post(`${url}/banco`, bankCreate)
  const outPutCreate = await responseCreate.data
  const bankId = await outPutCreate.id

  const fakeCodeUpdate = `${Math.random()}`.substring(2, 5)
  const fakeNameUpdate = `name ${Math.random()}`
  await connection.query(`delete from banco where codigo= ? or nome= ?`, [
    fakeCodeUpdate,
    fakeNameUpdate,
  ])
  const inputUpdate = {
    codigo: fakeCodeUpdate,
    nome: fakeNameUpdate,
    url: 'teste3.com.br',
  }
  const responseUpdate = await axios.put(`${url}/banco/${bankId}`, inputUpdate)
  const outPutUpdate = responseUpdate.data

  expect(responseUpdate.status).toBe(200)
  expect(outPutUpdate.id).toBe(bankId)
  expect(outPutUpdate.codigo).toBe(inputUpdate.codigo)
  expect(outPutUpdate.nome).toBe(inputUpdate.nome)
  expect(outPutUpdate.url).toBe(inputUpdate.url)

  const responseBank = await axios.get(`${url}/banco/${outPutCreate.id}`)
  const bankData = responseBank.data

  expect(bankData).toBeTruthy()
  expect(bankData.id).toBe(outPutUpdate.id)
  expect(bankData.codigo).toBe(outPutUpdate.codigo)
  expect(bankData.nome).toBe(outPutUpdate.nome)
  expect(bankData.url).toBe(outPutUpdate.url)

  const responseDelete = await axios.delete(`${url}/banco/${bankData.id}`)
  expect(responseDelete.status).toBe(200)
})
test.each(['Test'])(
  'nao deve  alterar um banco com nome invalido (PUT /banco)',
  async (rawName: any) => {
    const fakeCode = `${Math.random()}`.substring(2, 5)
    const fakeName = `name ${Math.random()}`
    await connection.query(`delete from banco where codigo= ? or nome= ?`, [
      fakeCode,
      fakeName,
    ])
    const bankCreate = {
      codigo: fakeCode,
      nome: fakeName,
      url: 'teste4.com.br',
    }
    const responseCreate = await axios.post(`${url}/banco`, bankCreate)

    const outPutCreate = await responseCreate.data
    const bankId = await outPutCreate.id

    const inputUpdate = {
      codigo: fakeCode,
      nome: rawName,
      url: 'teste3.com.br',
    }

    const responseUpdate = await axios.put(
      `${url}/banco/${bankId}`,
      inputUpdate,
    )

    expect(responseUpdate.status).toBe(422)
    const outPutUpdate = responseUpdate.data

    expect(outPutUpdate.message).toBe('Nome invalido')

    const responseDelete = await axios.delete(`${url}/banco/${bankId}`)
    expect(responseDelete.status).toBe(200)
  },
)
test('nao deve  alterar um banco que nao existe (PUT /banco)', async () => {
  const bankId = 9_999_99

  const inputUpdate = {
    codigo: '555',
    nome: 'rawName teste',
    url: 'teste3.com.br',
  }
  const responseUpdate = await axios.put(`${url}/banco/${bankId}`, inputUpdate)

  expect(responseUpdate.status).toBe(404)
  const outPutUpdate = responseUpdate.data
  expect(outPutUpdate.message).toBe('Banco nao localizado')
})
test('deve  deletar um banco (DELETE /banco)', async () => {
  const fakeCode = `${Math.random()}`.substring(2, 5)
  const fakeName = `name ${Math.random()}`
  await connection.query(`delete from banco where codigo= ? or nome= ?`, [
    fakeCode,
    fakeName,
  ])
  const inputCreate = {
    codigo: fakeCode,
    nome: fakeName,
    url: 'teste4.com.br',
  }
  const responseCreate = await axios.post(`${url}/banco`, inputCreate)
  const outPutCreate = await responseCreate.data
  const bankId = outPutCreate.id

  const responseDelete = await axios.delete(`${url}/banco/${bankId}`)
  expect(responseDelete.status).toBe(200)

  const resposeGet = await axios.get(`${url}/banco/${bankId}`)
  expect(resposeGet.status).toBe(404)
})
// convertional commits https://www.conventionalcommits.org/en/v1.0.0/
