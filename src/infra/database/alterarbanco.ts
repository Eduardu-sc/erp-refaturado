import { BancoDAO } from './bancoDao.ts'

export class AlterarBanco {
  constructor(private bankDao: BancoDAO) {}
  async execute(input: any) {
    const bankUpdate = await this.bankDao.update(input)
    return bankUpdate
  }
}
