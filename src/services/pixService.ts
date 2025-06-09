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

export const fetchAllPixFromAccountByAccountId = async (accountId: number|undefined, token: string): Promise<Pix[]|undefined> => {
  if(accountId===undefined)return 

  const response = await api.get(`/${accountId}/pix`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

export const deletePixByPixId = async (pixId: number, token: string): Promise<string> => {
  const response = await api.delete(`/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

export const createPix = async (accountId: number|null, pixKey: string|null, pixKeyType: string|null, token: string): Promise<Pix> => {
  const response = await api.post(`/${accountId}/pix`, {pixKey, pixKeyType}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}