import { api } from '../lib/axios'
import type { CreateUser } from '../types/dtos/user/createUser'
import type { UpdateUser } from '../types/dtos/user/updateUser'
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

  return response.data
}

export const fetchUserByUserId = async (userId: number, token: string): Promise<User> => {
  const response = await api.get(`/user/id=${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export const createUser = async (createUser: CreateUser) => {
  const response = await api.post('/user', createUser)
  
  return response.data
}

export const updateUser = async (userId: number, updateUser: UpdateUser, token: string): Promise<User> => {
  const response = await api.put(`/user/id=${userId}`, updateUser, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export const deleteUser = async (userId: number, token: string) => {
  const response = await api.delete(`/user/id=${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}