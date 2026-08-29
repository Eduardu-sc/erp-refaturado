import { BancoDao } from './bancoDao.ts'
import { UseCase } from './UserCase.ts'

export class CreateBank implements UseCase<
  CreateBank.Input,
  CreateBank.OutPut
> {
  constructor(private readonly bankDao: BancoDao) {}
  async execute(input: CreateBank.Input): Promise<CreateBank.OutPut> {
    if (!input.nome || !input.nome.match(/^.+\s.+$/)) {
      throw new Error('Nome invalido')
    }
    if (
      !input.codigo ||
      input.codigo.length !== 3 ||
      input.codigo.replace(/\D/g, '').length !== 3
    ) {
      throw new Error('Codigo invalido')
    }

    const bancoExistePorCode = await this.bankDao.getByCode(input.codigo)
    if (bancoExistePorCode) {
      throw new Error('Codigo Banco ja existe')
    }
    const bancoExisteName = await this.bankDao.getByName(input.nome)
    if (bancoExisteName) {
      throw new Error('Nome Banco ja existe')
    }
    const bankId = await this.bankDao.save(input)
    return {
      id: bankId,
      ...input,
    }
  }
}
export namespace CreateBank {
  export type Input = {
    codigo: string
    nome: string
    url: string
  }
  export type OutPut = {
    id: number
    codigo: string
    nome: string
    url: string
  }
}
