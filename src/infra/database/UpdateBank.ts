import { BankDAODataBase } from './bancoDao.ts'

export class UpdateBank {
  constructor(private bankDao: BankDAODataBase) {}
  async execute(input: any) {
    await this.bankDao.update(input)
    const bankUpdate = this.bankDao.getById(input.id)
    return bankUpdate
  }
}
