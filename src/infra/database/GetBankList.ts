import { BancoDao } from './bancoDao.ts'
import { UseCase } from './UserCase.ts'

export class GetBankList implements UseCase<
  GetBankList.Input,
  GetBankList.Output
> {
  constructor(private readonly bankDao: BancoDao) {}
  async execute(): Promise<GetBankList.Output> {
    const rows = await this.bankDao.list()
    return rows
  }
}

export namespace GetBankList {
  export type Input = any
  export type Output = {
    id: number
    codigo: string
    nome: string
    url: string
  }[]
}
