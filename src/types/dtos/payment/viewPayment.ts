export interface ViewPayment{
    idPayment: number
    receiverAccount: number,
    senderAccount: number,
    amountPaid: number,
    paymentRequestDate: number,
    paymentCompletionDate: number,
    paymentDescription: string
}