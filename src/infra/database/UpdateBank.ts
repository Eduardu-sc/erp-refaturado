import { ApplicationError } from './ApplicationError.ts'
import { BankRepository } from './bankRepository.ts'
import { NotFoundError } from './NotFoundError.ts'
import { UseCase } from './UserCase.ts'

export class UpdateBank implements UseCase<
  UpdateBank.Input,
  UpdateBank.Output
> {
  constructor(private _bankRepository: BankRepository) {}
  async execute(input: UpdateBank.Input): Promise<UpdateBank.Output> {
    const bank = await this._bankRepository.findById(input.id)
    if (!bank) {
      throw new NotFoundError('Banco nao localizado')
    }

    if (bank.getCode() !== input.codigo) {
      const bankSecundario = await this._bankRepository.findByCode(input.codigo)
      bank.changeCode(input.codigo)
      if (bankSecundario) {
        throw new ApplicationError(
          'nao e possivel alterar o banco para um codigo ja existente',
        )
      }
    }
    if (bank.getName() !== input.nome) {
      const bankSecundario = await this._bankRepository.findByName(input.nome)
      bank.changeName(input.nome)
      if (bankSecundario) {
        throw new ApplicationError(
          'nao e possivel alterar o banco para um Nome ja existente',
        )
      }
    }

    bank.setUrl(input.url)

    await this._bankRepository.update(bank)

    return {
      id: bank.getBankId(),
      nome: bank.getName(),
      codigo: bank.getCode(),
      url: bank.getUrl(),
    }
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
