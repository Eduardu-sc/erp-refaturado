import axios from 'axios'
axios.defaults.validateStatus = () => true
const url = 'http://localhost:3001'

test('deve retornar a lista de bancos (GET /Banco)', async () => {
  const bankCreate = {
    codigo: '554',
    nome: 'teste teste',
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
  const bankCreate = {
    codigo: '554',
    nome: 'teste teste',
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
  const inputCreate = {
    codigo: '555',
    nome: 'teste',
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
test('deve  alterar um banco (PUT /banco)', async () => {
  const bankCreate = {
    codigo: '555',
    nome: 'teste',
    url: 'teste4.com.br',
  }
  const responseCreate = await axios.post(`${url}/banco`, bankCreate)
  const outPutCreate = await responseCreate.data
  const bankId = await outPutCreate.id
  const inputUpdate = {
    codigo: '555',
    nome: 'teste 3',
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
test('deve  deletar um banco (DELETE /banco)', async () => {
  const inputCreate = {
    codigo: '555',
    nome: 'teste',
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
