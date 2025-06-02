import { api } from '../lib/axios'
import type { User } from '../types/user'

export const fetchUserByToken = async (token: string): Promise<User> => {
  const payloadBase64 = token.split(".")[1]
  const payload = JSON.parse(atob(payloadBase64))
  const email = payload.sub

  const response = await api.get(`/user/email=${email}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data.content ?? response.data
}
