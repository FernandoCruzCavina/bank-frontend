import { api } from "../lib/axios";
import type { CreatePayment } from "../types/dtos/payment/createPayment";
import type { Payment } from "../types/payment";
import { Client } from "@stomp/stompjs";
import { WebSocket } from 'ws';

// export const sendPix = async() => {
//     Object.assign(global, {WebSocket})

//     const client = new Client({
//         brokerURL: 'ws://localhost:8080/ws-payment',
//         onConnect: () => {
//             client.subscribe('/topic/test01', message => console.log(`Received: ${message.body}`));
//            client.publish({
//                 destination: "/payment/request",
//                 body: JSON.stringify({
//                     idAccount: senderId,
//                     pixKey: pixTarget.key,
//                     amountPaid: Number(paymentAmount),
//                     paymentDescription: "Transferência via WebSocket"
//                 }),
//             });
//         },
//     });

//     client.activate()
// }




export const extract = async(accountId: number, token: string): Promise<Payment[]> => {
    const response = await api.get(`/payment/${accountId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data
}