import { Bank } from './bank.ts'

export interface BankRepository {
  save(bank: Bank): Promise<Bank>
  list(): Promise<Bank[]>
  findById(id: number): Promise<Bank | undefined>
  update(dto: Bank): Promise<void>
  remove(id: number): Promise<void>
  findByCode(codigo: string): Promise<Bank | undefined>
  findByName(name: string): Promise<Bank | undefined>
}
