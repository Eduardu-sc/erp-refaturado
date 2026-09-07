import { Bank } from '@infra/database/bank.ts'
import { BankRepository } from '@infra/database/bankRepository.ts'

export class BankRepositoryFake implements BankRepository {
  private bankList: Bank[] = []
  async save(bank: Bank): Promise<Bank> {
    const bankId = this.bankList.length + 1
    const newBank = Bank.restore({
      name: bank.getName(),
      code: bank.getCode(),
      url: bank.getUrl(),
      bankId,
    })
    this.bankList.push(newBank)
    return newBank
  }

  async findByCode(codigo: string): Promise<Bank | undefined> {
    return this.bankList.find((bank) => bank.getCode() === codigo)
  }

  async findById(id: number): Promise<Bank | undefined> {
    return this.bankList.find((bank) => bank.getBankId() === id)
  }

  async findByName(name: string): Promise<Bank | undefined> {
    return this.bankList.find((bank) => bank.getName() === name)
  }

  async list(): Promise<Bank[]> {
    return this.bankList
  }

  async remove(id: number): Promise<void> {
    this.bankList = this.bankList.filter((bank) => bank.getBankId() !== id)
  }

  async update(bankUpdate: Bank): Promise<void> {
    this.bankList = this.bankList.map((bank) => {
      if (bank.getBankId() !== bankUpdate.getBankId()) {
        return Bank.restore({
          bankId: bank.getBankId(),
          code: bankUpdate.getCode(),
          name: bankUpdate.getName(),
          url: bankUpdate.getUrl(),
        })
      }
      return bank
    })
  }
}
