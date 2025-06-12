import type { ConfirmCode } from "@/types/dtos/auth/confirmCode";
import { api } from "../lib/axios";
import type { Payment } from "../types/payment";
import type { SendEmail } from "@/types/dtos/payment/emailSender";
import type { CreatePayment } from "@/types/dtos/payment/createPayment";

export const requestSendPix = async(accountId: number, pixKey: string, email: string, token: string): Promise<string> => {
    const sendEmail: SendEmail = {
        email: email
    }
    const response = await api.post(`/payment/${accountId}/pix/${pixKey}`, sendEmail, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}

export const sendPix = async(confirmCode: ConfirmCode): Promise<string> => {
    const response = await api.post(`/auth/validate`, confirmCode, {})

    return response.data
}

export const extract = async(accountId: number, token: string): Promise<Payment[]> => {
    const response = await api.get(`/payment/${accountId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data
}

export const sendPixDirect = async(accountId: number, pixKey: string, paymentDto: CreatePayment, token: string): Promise<string> => {
    const response = await api.post(`/payment/${accountId}/pix/${pixKey}/direct`, paymentDto, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data
}