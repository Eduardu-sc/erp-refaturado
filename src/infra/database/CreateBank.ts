import { BancoDao } from './bancoDao.ts'

export class CreateBank {
  constructor(private readonly bankDao: BancoDao) {}
  async execute(input: any): Promise<any> {
    return this.bankDao.save(input)
  }
}
