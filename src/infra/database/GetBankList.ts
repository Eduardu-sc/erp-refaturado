import { BankRepository } from './bankRepository.ts'
import { UseCase } from './UserCase.ts'

export class GetBankList implements UseCase<
  GetBankList.Input,
  GetBankList.Output
> {
  constructor(private readonly _bankRepository: BankRepository) {}
  async execute(): Promise<GetBankList.Output> {
    const rows = await this._bankRepository.list()
    return rows.map((bank) => ({
      id: bank.getBankId(),
      nome: bank.getName(),
      codigo: bank.getCode(),
      url: bank.getUrl(),
    }))
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
