import { BancoDao } from '@infra/database/bancoDao.ts'

export class BankDaoMemory implements BancoDao {
  private bankMemory: any[]
  constructor() {
    this.bankMemory = []
  }

  async save(dto: any): Promise<number> {
    const id = this.bankMemory.length + 1
    this.bankMemory.push({ id, ...dto })
    return id
  }

  async list(): Promise<any[]> {
    return this.bankMemory
  }

  async getById(id: number): Promise<any> {
    return this.bankMemory.find((item) => item.id === id)
  }

  async update(dto: any): Promise<void> {
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
