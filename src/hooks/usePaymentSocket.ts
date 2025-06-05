import { useEffect, useRef } from "react"
import { Client, type IMessage} from "@stomp/stompjs"
import type { CreatePayment } from "../types/dtos/payment/createPayment"

type MessageHandler = (msg: string, respond: (confirm: boolean) => void) => void

export const usePaymentSocket = (
  onMessage: MessageHandler,
  username: string,
  enabled: boolean
) => {
  const clientRef = useRef<Client | null>(null)
  const confirmDestinationRef = useRef<string | null>(null)

  useEffect(() => {
    if (!enabled) return

    const client = new Client({
      brokerURL: "ws://localhost:8082/ws-payment",
      reconnectDelay: 5000,
      connectHeaders: {
        username: username,
      }
    })

    client.onConnect = () => {
      client.subscribe("/user/queue/confirm", (message: IMessage) => {
        const body = JSON.parse(message.body)
        const msg = body.message
        const confirmDestination = body.confirmDestination
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
  }, [enabled, username])

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