import { BancoDao } from './bancoDao.ts'
import { UseCase } from './UserCase.ts'

export class RemoveBank implements UseCase<
  RemoveBank.Input,
  RemoveBank.Output
> {
  constructor(private readonly bankDao: BancoDao) {}

  async execute(input: RemoveBank.Input): Promise<RemoveBank.Output> {
    await this.bankDao.remove(input.id)
  }
}

export namespace RemoveBank {
  export type Input = {
    id: number
  }
  export type Output = void
}
