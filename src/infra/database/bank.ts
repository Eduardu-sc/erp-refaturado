import { validateBankCode } from './validateBankCode.ts'
import { validateBankName } from './validateBankName.ts'

export class Bank {
  private constructor(
    private BankId: number,
    private name: string,
    private code: string,
    private url: string,
  ) {
    if (!validateBankName(name)) {
      throw new Error('Nome invalido')
    }
    if (!validateBankCode(code)) {
      throw new Error('Codigo invalido')
    }
  }

  static create({ name, code, url }: Bank.CreateParams): Bank {
    return new Bank(0, name, code, url)
  }

  static restore({ name, code, url, bankId }: Bank.RestoreParams): Bank {
    return new Bank(bankId, name, code, url)
  }

  getName() {
    return this.name
  }

  getCode() {
    return this.code
  }

  getUrl() {
    return this.url
  }

  getBankId() {
    return this.BankId
  }

  changeCode(code: string) {
    if (!validateBankCode(code)) throw new Error('Codigo invalido')
    this.code = code
  }

  changeName(name: string) {
    if (!validateBankName(name)) {
      throw new Error('Nome invalido')
    }
    this.name = name
  }

  setUrl(url: string) {
    this.url = url
  }
}
export namespace Bank {
  export type CreateParams = {
    name: string
    code: string
    url: string
  }
  export type RestoreParams = {
    bankId: number
    name: string
    code: string
    url: string
  }
}
