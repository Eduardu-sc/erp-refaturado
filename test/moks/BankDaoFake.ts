import { BancoDao, BankDao } from '@infra/database/bancoDao.ts'

export class BankDaoFake implements BancoDao {
  private bankMemory: BankDao.BankDto[]
  constructor() {
    this.bankMemory = []
  }

  async getByName(name: string): Promise<BankDao.BankDto | undefined> {
    return this.bankMemory.find((item) => item.nome === name)
  }

  async getByCode(codigo: string): Promise<BankDao.BankDto | undefined> {
    return this.bankMemory.find((item) => item.codigo === codigo)
  }

  async save(dto: BankDao.SaveDto): Promise<number> {
    const id = this.bankMemory.length + 1
    this.bankMemory.push({ id, ...dto })
    return id
  }

  async list(): Promise<BankDao.BankDto[]> {
    return this.bankMemory
  }

  async getById(id: number): Promise<BankDao.BankDto | undefined> {
    return this.bankMemory.find((item) => item.id === id)
  }

  async update(dto: BankDao.UpdateDto): Promise<void> {
    this.bankMemory = this.bankMemory.map((banco) => {
      if (banco.id !== dto.id) {
        return banco
      }
      return { ...banco, ...dto }
    })
  }

  async remove(id: number): Promise<void> {
    this.bankMemory = this.bankMemory.filter((item) => item.id !== id)
  }
}
