import { api } from '../lib/axios'
import type { Account } from '../types/account'

export const fetchAccountByUserId = async (userId: number, token: string): Promise<Account> => {
  const response = await api.get(`/account/userId/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export const fetchAccountByPix= async (pixKey: string, token: string): Promise<Account> => {
  const response = await api.get(`/account/pix/${pixKey}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}
