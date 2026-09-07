import { BankRepository } from './bankRepository.ts'
import { UseCase } from './UserCase.ts'

export class GetBankById implements UseCase<
  GetBankById.Input,
  GetBankById.OutPut
> {
  constructor(private readonly _bankRepository: BankRepository) {}
  async execute(input: GetBankById.Input): Promise<GetBankById.OutPut> {
    const bank = await this._bankRepository.findById(input.id)
    if (!bank) {
      return undefined
    }
    return {
      id: bank.getBankId(),
      nome: bank.getName(),
      codigo: bank.getCode(),
      url: bank.getUrl(),
    }
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
