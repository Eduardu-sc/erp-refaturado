import { BancoDao } from './bancoDao.ts'
import { UseCase } from './UserCase.ts'

export class GetBankById implements UseCase<
  GetBankById.Input,
  GetBankById.OutPut
> {
  constructor(private readonly bankDao: BancoDao) {}
  async execute(input: GetBankById.Input): Promise<GetBankById.OutPut> {
    const bank = await this.bankDao.getById(input.id)
    if (!bank) {
      return undefined
    }
    return bank
  }
}
export namespace GetBankById {
  export type Input = {
    id: number
  }
  export type OutPut =
    | {
        id: number
        codigo: string
        nome: string
        url: string
      }
    | undefined
}
