export interface ConfirmCode{
    key: string,
    code: string,
    idAccount: number,
    pixKey: string,
    paymentDescription: string,
    amountPaid: number
}