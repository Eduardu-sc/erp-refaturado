import { Bank } from './bank.ts'
import { BankRepository } from './bankRepository.ts'
import { UseCase } from './UserCase.ts'

export class CreateBank implements UseCase<
  CreateBank.Input,
  CreateBank.OutPut
> {
  constructor(private readonly _bankRepository: BankRepository) {}
  async execute(input: CreateBank.Input): Promise<CreateBank.OutPut> {
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

    const bancoExistePorCode = await this._bankRepository.findByCode(
      input.codigo,
    )
    if (bancoExistePorCode) {
      throw new Error('Codigo Banco ja existe')
    }
    const bancoExisteName = await this._bankRepository.findByName(input.nome)
    if (bancoExisteName) {
      throw new Error('Nome Banco ja existe')
    }
    const bank = Bank.create({
      code: input.codigo,
      name: input.nome,
      url: input.url,
    })

    const bankSaved = await this._bankRepository.save(bank)
    return {
      id: bankSaved.getBankId(),
      ...input,
    }
  }
}
export namespace CreateBank {
  export type Input = {
    codigo: string
    nome: string
    url: string
  }
  export type OutPut = {
    id: number
    codigo: string
    nome: string
    url: string
  }
}
