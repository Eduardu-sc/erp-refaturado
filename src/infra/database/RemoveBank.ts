import { BankRepository } from './bankRepository.ts'
import { UseCase } from './UserCase.ts'

export class RemoveBank implements UseCase<
  RemoveBank.Input,
  RemoveBank.Output
> {
  constructor(private readonly _bankRepository: BankRepository) {}

  async execute(input: RemoveBank.Input): Promise<RemoveBank.Output> {
    await this._bankRepository.remove(input.id)
  }
}

export namespace RemoveBank {
  export type Input = {
    id: number
  }
  export type Output = void
}
