export interface Payment{
    idPayment: number,
    paymentType: string,
    paymentDescription: string,
    amountPaid: number,
    currencyType: string,
    paymentRequestDate: number,
    paymentCompletionDate: number,
    senderAccount: number,
    receiverAccount: number
}