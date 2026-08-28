import axios from 'axios'

axios.defaults.validateStatus = () => true

const url = 'http://localhost:3001'

test('deve retornar a lista de bancos (GET /Banco)', async () => {
  const bankCreate = {
    codigo: '554',
    nome: 'teste teste',
    url: 'teste5.com.br',
  }

  let bankId: number | undefined

  try {
    const responseCreate = await axios.post(`${url}/banco`, bankCreate)
    const outPutCreate = responseCreate.data
    bankId = outPutCreate.id

    const response = await axios.get(`${url}/banco`)
    const outPut = response.data

    expect(response.status).toBe(200)
    expect(outPut).toBeInstanceOf(Array)
    expect(outPut.length).toBeGreaterThanOrEqual(1)

    const bancoData = outPut.find((item) => item.id === bankId)

    expect(bancoData).toBeTruthy()
    expect(bancoData.id).toBe(bankId)
    expect(bancoData.codigo).toBe(bankCreate.codigo)
    expect(bancoData.nome).toBe(bankCreate.nome)
    expect(bancoData.url).toBe(bankCreate.url)
  } finally {
    if (bankId) {
      await axios.delete(`${url}/banco/${bankId}`)
    }
  }
})

test('deve retornar um banco (GET /Banco/1)', async () => {
  const bankCreate = {
    codigo: '554',
    nome: 'teste teste',
    url: 'teste5.com.br',
  }

  let bankId: number | undefined

  try {
    const responseCreate = await axios.post(`${url}/banco`, bankCreate)
    const outPutCreate = responseCreate.data
    bankId = outPutCreate.id

    const response = await axios.get(`${url}/banco/${bankId}`)
    const outPut = response.data

    expect(response.status).toBe(200)
    expect(outPut).toBeInstanceOf(Object)

    expect(outPut.id).toBe(bankId)
    expect(outPut.codigo).toBe(outPutCreate.codigo)
    expect(outPut.nome).toBe(outPutCreate.nome)
    expect(outPut.url).toBe(outPutCreate.url)
  } finally {
    if (bankId) {
      await axios.delete(`${url}/banco/${bankId}`)
    }
  }
})

test('deve criar um banco (POST /banco)', async () => {
  const inputCreate = {
    codigo: '555',
    nome: 'teste teste',
    url: 'teste4.com.br',
  }

  let bankId: number | undefined

  try {
    const responseCreate = await axios.post(`${url}/banco`, inputCreate)
    const outPutCreate = responseCreate.data
    bankId = outPutCreate.id

    expect(responseCreate.status).toBe(201)

    const responseBank = await axios.get(`${url}/banco/${bankId}`)
    const bankData = responseBank.data

    expect(bankData).toBeTruthy()
    expect(bankData.id).toBe(bankId)
    expect(bankData.codigo).toBe(outPutCreate.codigo)
    expect(bankData.nome).toBe(outPutCreate.nome)
    expect(bankData.url).toBe(outPutCreate.url)
  } finally {
    if (bankId) {
      await axios.delete(`${url}/banco/${bankId}`)
    }
  }
})

test.each(['Test'])(
  'Não deve criar um banco nome invalido %s (POST /banco)',
  async (rawName: any) => {
    const inputCreate = {
      codigo: '555',
      nome: rawName,
      url: 'teste4.com.br',
    }

    const responseCreate = await axios.post(`${url}/banco`, inputCreate)

    expect(responseCreate.status).toBe(422)

    const outPutCreate = responseCreate.data

    expect(outPutCreate.message).toBe('Nome invalido')
  },
)

test('deve alterar um banco (PUT /banco)', async () => {
  const bankCreate = {
    codigo: '555',
    nome: 'teste teste',
    url: 'teste4.com.br',
  }

  let bankId: number | undefined

  try {
    const responseCreate = await axios.post(`${url}/banco`, bankCreate)
    const outPutCreate = responseCreate.data
    bankId = outPutCreate.id

    const inputUpdate = {
      codigo: '555',
      nome: 'teste 3',
      url: 'teste3.com.br',
    }

    const responseUpdate = await axios.put(
      `${url}/banco/${bankId}`,
      inputUpdate,
    )

    const outPutUpdate = responseUpdate.data

    expect(responseUpdate.status).toBe(200)
    expect(outPutUpdate.id).toBe(bankId)
    expect(outPutUpdate.codigo).toBe(inputUpdate.codigo)
    expect(outPutUpdate.nome).toBe(inputUpdate.nome)
    expect(outPutUpdate.url).toBe(inputUpdate.url)

    const responseBank = await axios.get(`${url}/banco/${bankId}`)
    const bankData = responseBank.data

    expect(bankData).toBeTruthy()
    expect(bankData.id).toBe(outPutUpdate.id)
    expect(bankData.codigo).toBe(outPutUpdate.codigo)
    expect(bankData.nome).toBe(outPutUpdate.nome)
    expect(bankData.url).toBe(outPutUpdate.url)
  } finally {
    if (bankId) {
      await axios.delete(`${url}/banco/${bankId}`)
    }
  }
})

test.each(['Test'])(
  'nao deve alterar um banco com nome invalido (PUT /banco)',
  async (rawName: any) => {
    const bankCreate = {
      codigo: '555',
      nome: 'teste teste',
      url: 'teste4.com.br',
    }

    let bankId: number | undefined

    try {
      const responseCreate = await axios.post(`${url}/banco`, bankCreate)
      const outPutCreate = responseCreate.data
      bankId = outPutCreate.id

      const inputUpdate = {
        codigo: '555',
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
    } finally {
      if (bankId) {
        await axios.delete(`${url}/banco/${bankId}`)
      }
    }
  },
)

test('nao deve alterar um banco que nao existe (PUT /banco)', async () => {
  const bankId = 99_999_99

  const inputUpdate = {
    codigo: '555',
    nome: 'teste teste',
    url: 'teste3.com.br',
  }

  const responseUpdate = await axios.put(`${url}/banco/${bankId}`, inputUpdate)

  expect(responseUpdate.status).toBe(404)

  const outPutUpdate = responseUpdate.data

  expect(outPutUpdate.message).toBe('Banco nao localizado')
})

test('deve deletar um banco (DELETE /banco)', async () => {
  const inputCreate = {
    codigo: '555',
    nome: 'teste teste',
    url: 'teste4.com.br',
  }

  let bankId: number | undefined

  try {
    const responseCreate = await axios.post(`${url}/banco`, inputCreate)
    const outPutCreate = responseCreate.data
    bankId = outPutCreate.id

    const responseDelete = await axios.delete(`${url}/banco/${bankId}`)

    expect(responseDelete.status).toBe(200)

    const responseGet = await axios.get(`${url}/banco/${bankId}`)

    expect(responseGet.status).toBe(404)

    // Já foi removido com sucesso
    bankId = undefined
  } finally {
    // Se o teste falhar antes do DELETE, garante a limpeza
    if (bankId) {
      await axios.delete(`${url}/banco/${bankId}`)
    }
  }
})
