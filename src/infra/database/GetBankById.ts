import { BancoDao } from './bancoDao.ts'

export class GetBankById {
  constructor(private readonly bankDao: BancoDao) {}
  async execute(id: number): Promise<any> {
    return this.bankDao.getById(id)
  }
}
