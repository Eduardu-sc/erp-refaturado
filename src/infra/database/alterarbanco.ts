import { update } from './database.ts'

export const alteraBanco = async (input: any) => {
  const bankUpdate = await update(input)
  return bankUpdate
}
