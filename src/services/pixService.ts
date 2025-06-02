import { api } from "../lib/axios"
import type { Pix } from "../types/pix"

export const fetchPixByAccountId = async (accountId: number|undefined, token: string): Promise<Pix|undefined> => {
  if(accountId===undefined){return}
  
  const response = await api.get(`/pix/${accountId}/pix`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}