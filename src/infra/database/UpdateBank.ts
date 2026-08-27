import { BankDAODataBase } from './bancoDao.ts'
import { UseCase } from './UserCase.ts'

export class UpdateBank implements UseCase<
  UpdateBank.Input,
  UpdateBank.Output
> {
  constructor(private bankDao: BankDAODataBase) {}
  async execute(input: UpdateBank.Input): Promise<UpdateBank.Output> {
    const bank = await this.bankDao.getById(input.id)
    if (!bank) {
      throw new Error('Banco nao localizado')
    }
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

    const bankUpdate = { ...bank, ...input }
    await this.bankDao.update(bankUpdate)

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
