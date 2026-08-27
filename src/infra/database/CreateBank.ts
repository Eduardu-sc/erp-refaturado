import { BancoDao } from './bancoDao.ts'
import { UseCase } from './UserCase.ts'

export class CreateBank implements UseCase<
  CreateBank.Input,
  CreateBank.OutPut
> {
  constructor(private readonly bankDao: BancoDao) {}
  async execute(input: CreateBank.Input): Promise<CreateBank.OutPut> {
    if (!input.nome || !input.nome.match(/^.+\s.+$/))
    { throw new Error('Nome invalido') }

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
