import { BancoDao } from './bancoDao.ts'

export class GetBankById {
  constructor(private readonly bankDao: BancoDao) {}
  async execute(input: any): Promise<any> {
    return this.bankDao.getById(input.id)
  }
}
