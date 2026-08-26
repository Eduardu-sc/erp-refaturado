import { BankDAODataBase } from './bancoDao.ts'
import { UseCase } from './UserCase.ts'

export class UpdateBank implements UseCase<
  UpdateBank.Input,
  UpdateBank.Output
> {
  constructor(private bankDao: BankDAODataBase) {}
  async execute(input: UpdateBank.Input): Promise<UpdateBank.Output> {
    await this.bankDao.update(input)
    const bankUpdate = await this.bankDao.getById(input.id)
    return bankUpdate
  }
}
export namespace UpdateBank {
  export type Input = {
    id: number
    codigo: string
    nome: string
    url: string
  }
  export type Output =
    | {
        id: number
        codigo: string
        nome: string
        url: string
      }
    | undefined
}
