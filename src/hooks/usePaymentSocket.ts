import { useEffect, useRef, useState } from "react"
import { Client } from "@stomp/stompjs"
import type { RequestPayment } from "../types/dtos/payment/requestPayment"
import type { CreatePayment } from "../types/dtos/payment/createPayment"

export const usePaymentSocket = (
  onConfirm: (msg: string, respond: () => void) => void,
  username: string,
  ready: boolean
): { sendPaymentRequest: (payment: RequestPayment) => void } => {
  const [client, setClient] = useState<Client | null>(null)
  const lastPaymentRef = useRef<RequestPayment | null>(null)

  useEffect(() => {
    if (!ready || !username) return

    const stomp = new Client({
      brokerURL: "ws://localhost:8082/ws-payment",
      onConnect: () => {
        stomp.subscribe("/user/queue/confirm", (message) => {
          const msg = message.body

          const respond = () => {
            if (!lastPaymentRef.current) return

            const confirmation: CreatePayment = {
              ...lastPaymentRef.current,
              isConfirm: true,
            }

            stomp.publish({
              destination: "/app/confirm",
              body: JSON.stringify(confirmation),
              headers: { username },
            })
          }

          onConfirm(msg, respond)
        })
        stomp.subscribe("/user/queue/status", (message) => {
          console.log("Status recebido do backend:", message.body)
        })
      },
    })
    stomp.activate()
    setClient(stomp)

    return () => {
      stomp.deactivate()
      setClient(null)
    }
  }, [ready, username, onConfirm])

  const sendPaymentRequest = (payment: RequestPayment) => {
    if (!client?.connected) {
      console.warn("WebSocket não conectado ainda.")
      return
    }

    lastPaymentRef.current = payment

    client.publish({
      destination: "/app/request",
      body: JSON.stringify(payment),
      headers: { username },
    })
  }

  return { sendPaymentRequest }
}