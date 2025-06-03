import { api } from "../lib/axios"
import type { LoginUser } from "../types/dtos/auth/login"

export const login = async (loginUser: LoginUser) => {
    const response = await api.post('/auth/login', loginUser)

    return response.data
}

export const refresh = async () => {
    
}