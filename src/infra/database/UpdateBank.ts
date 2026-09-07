import { BankRepository } from './bankRepository.ts'
import { UseCase } from './UserCase.ts'

export class UpdateBank implements UseCase<
  UpdateBank.Input,
  UpdateBank.Output
> {
  constructor(private _bankRepository: BankRepository) {}
  async execute(input: UpdateBank.Input): Promise<UpdateBank.Output> {
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
    const bank = await this._bankRepository.findById(input.id)
    if (!bank) {
      throw new Error('Banco nao localizado')
    }

    if (bank.getCode() !== input.codigo) {
      const bankSecundario = await this._bankRepository.findByCode(input.codigo)

      if (bankSecundario) {
        throw new Error(
          'nao e possivel alterar o banco para um codigo ja existente',
        )
      }
    }
    if (bank.getName() !== input.nome) {
      const bankSecundario = await this._bankRepository.findByName(input.nome)

      if (bankSecundario) {
        throw new Error(
          'nao e possivel alterar o banco para um Nome ja existente',
        )
      }
    }

    bank.setCode(input.codigo)
    bank.setName(input.nome)
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
