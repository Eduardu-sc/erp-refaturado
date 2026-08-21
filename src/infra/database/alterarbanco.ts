import { BancoDAO } from './bancoDao.ts'

export const alteraBanco = async (input: any) => {
  const bankDao = new BancoDAO()
  const bankUpdate = await bankDao.update(input)
  return bankUpdate
}
