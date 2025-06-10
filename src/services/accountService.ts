import type { Payment } from '@/types/payment'
import { api } from '../lib/axios'
import type { Account } from '../types/account'
import type { ViewPayment } from '@/types/dtos/payment/viewPayment'

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

export const fetchExtractByAccountId= async (accountId: number, token: string): Promise<ViewPayment[]> => {
  const response = await api.get(`/account/extrato/${accountId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}