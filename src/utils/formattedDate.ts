import type { Account } from "@/types/account"
import type { User } from "../types/user"

const convertToSaoPauloEpoch = (epochUTC: number): number => {
    const date = new Date(epochUTC)
    const formatted = date.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    })
    
    return formatted as unknown as number
  }

export const formatUserDates = (user: User | undefined): User => {
  if (!user || !user.birthdayDate) return user as User

  const date = convertToSaoPauloEpoch(user.birthdayDate)
  
  return {
    ...user,
    birthdayDate: date as unknown as number
  }
}

export const formatAccountDates = (account: Account | undefined): Account | undefined => {
  if (!account) return undefined

  const dateCreatedAt = convertToSaoPauloEpoch(account.createdAt)
  const dateLastUpdateAt = convertToSaoPauloEpoch(account.lastUpdatedAt)
  
  return {
    ...account,
    createdAt: dateCreatedAt,
    lastUpdatedAt: dateLastUpdateAt
  }
}

export const formatDate = (epochUTC: number | undefined) => {
  if (!epochUTC) return ""

  return new Date(epochUTC).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}