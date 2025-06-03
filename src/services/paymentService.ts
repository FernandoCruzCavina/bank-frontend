import { api } from "../lib/axios";
import type { CreatePayment } from "../types/dtos/payment/createPayment";
import type { Payment } from "../types/payment";

export const sendPix = async(accountId: number,pixKey: string, createPayment: CreatePayment, token: string): Promise<Payment>  => {
    const response = await api.post(`${accountId}/pix/${pixKey}`, createPayment, {
        headers: {
            Authorization: `bearer ${token}`
        }
    })
    
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