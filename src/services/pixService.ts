import type { PixDto } from "@/types/dtos/account/pixDto"
import { api } from "../lib/axios"
import type { Pix } from "../types/pix"

export const fetchPixByAccountId = async (accountId: number|undefined, token: string): Promise<Pix[]|undefined> => {
  if(accountId===undefined){return}
  
  const response = await api.get(`/account/${accountId}/pix`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export const fetchAllPixFromAccountByAccountId = async (accountId: number|undefined, token: string): Promise<Pix[]|undefined> => {
  if(accountId===undefined)return 

  const response = await api.get(`/account/${accountId}/pix`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

export const deletePixByPixId = async (accountId: number, pixId: number, token: string): Promise<string> => {
  const response = await api.delete(`/account/${accountId}/pix/${pixId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

export const createPix = async (accountId: number|null, pixKey: string|null, keyType: string, token: string): Promise<Pix> => {
  const key: PixDto = {
    key: pixKey,
    keyType: keyType
  }
  const response = await api.post(`/account/${accountId}/pix`, key, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

export const updatePix = async (accountId: number|undefined, pixKey: string|null, pixId: number|null, keyType: string, token: string): Promise<Pix> => {
  const updatePix: PixDto = {
    key: pixKey,
    keyType: keyType
  }
  const response = await api.put(`/account/${accountId}/pix/${pixId}`, updatePix, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}