import { useEffect, useRef } from "react"
import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs"
import type { CreatePayment } from "../types/dtos/payment/createPayment"

type MessageHandler = (msg: string, respond: (confirm: boolean) => void) => void

export const usePaymentSocket = (onMessage: MessageHandler) => {
  const clientRef = useRef<Client | null>(null)
  const confirmDestinationRef = useRef<string | null>(null)

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000,
    })

    client.onConnect = () => {
      const subscription: StompSubscription = client.subscribe("/user/queue/confirm", (message: IMessage) => {
        const body = JSON.parse(message.body)
        const msg = body.message
        const confirmDestination = body.confirmDestination // por ex: /app/payment/confirm/12345
        confirmDestinationRef.current = confirmDestination

        onMessage(msg, (confirmed: boolean) => {
          if (confirmDestination) {
            client.publish({
              destination: confirmDestination,
              body: JSON.stringify({ confirmed }),
            })
          }
        })
      })
    }

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
    }
  }, [])

  const sendPaymentRequest = (payment: CreatePayment) => {
    if (!clientRef.current || !clientRef.current.connected) {
      throw new Error("WebSocket não conectado")
    }

    clientRef.current.publish({
      destination: "/app/payment/request",
      body: JSON.stringify(payment),
    })
  }

  return { sendPaymentRequest }
}


