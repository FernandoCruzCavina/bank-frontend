import { fetchExtractByAccountId } from "@/services/accountService"
import { motion } from "motion/react"
import { useEffect, useState } from "react"
import type { ViewPayment } from "../../types/dtos/payment/viewPayment"

const History = ({accountId}:{accountId: number | undefined}) => {
  const [transfers, setTransfers] = useState<ViewPayment[]>([])

  useEffect(()=>{
    const init = async()=>{
      const token = localStorage.getItem('token')
      if(!token || !accountId)return
      const paymentAll = await fetchExtractByAccountId(accountId, token)
      console.log(paymentAll)
      setTransfers(paymentAll)
    }
    init()
  }, [])


  return (
    <div className="space-y-4 p-4">
      {transfers.length > 0 && (
        <motion.div 
          initial={"hidden"}
          animate={"visible"}
          variants={itemVariants}
          className="space-y-3 ">
          {transfers.map((t) => (
            <div key={t.idPayment}className="bg-[var(--primary-brad-3)] p-4 rounded text-white space-y-1 shadow-2xl">
              <p><strong>Enviador:</strong> {t.senderAccount}</p>
              <p><strong>Destinatário:</strong> {t.receiverAccount}</p>
              <p><strong>Valor:</strong> {t.amountPaid}</p>
              <p><strong>Data:</strong> {t.paymentCompletionDate}</p>
              <p><strong>Descrição:</strong> {t.paymentDescription}</p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    },
  },
}

export default History
