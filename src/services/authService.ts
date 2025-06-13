import type { AuthenticationTokensDto } from "@/types/dtos/auth/authenticationTokens"
import { api } from "../lib/axios"
import type { LoginUser } from "../types/dtos/auth/login"

export const login = async (loginUser: LoginUser | undefined): Promise<AuthenticationTokensDto> => {
    const response = await api.post('/auth/login', loginUser)

    return response.data
}

export const refresh = async () => {
    
}

export const getTokenFromRefreshToken = async (refreshToken: string): Promise<string> => {
    const response = await api.post('/auth/refresh', refreshToken, {})

    return response.data
}