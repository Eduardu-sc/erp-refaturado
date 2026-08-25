import { BancoDao } from './bancoDao.ts'

export class RemoveBank {
  constructor(private readonly bankDao: BancoDao) {}

  async execute(input: any): Promise<void> {
    this.bankDao.remove(input.id)
  }
}
