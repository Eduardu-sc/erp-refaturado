import { BancoDao } from './bancoDao.ts'

export class GetBankList {
  constructor(private readonly bankDao: BancoDao) {}
  async execute(): Promise<any> {
    const rows = await this.bankDao.list()
    return rows
  }
}
