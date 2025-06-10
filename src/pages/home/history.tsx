import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { extract } from "../../services/paymentService"
import type { ViewPayment } from "../../types/dtos/payment/viewPayment"
import { fetchExtractByAccountId } from "@/services/accountService"

const History = ({accountId}:{accountId: number | undefined}) => {
  const [query, setQuery] = useState("")
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

  // const handleSearch = async() => {
  //   const token = localStorage.getItem('token')

  //   if(token===null||accountId===undefined) return
    
  //   const payments = await extract(accountId, token)

  //   const formattedTransfers: ViewPayment[] = payments.map((payment) => ({
  //     id: payment.idPayment,
  //     receiver: payment.receiverAccount,
  //     sender: payment.senderAccount,
  //     amount: payment.amountPaid,
  //     date: payment.paymentCompletionDate,
  //     description: payment.paymentDescription
  //   }))

  //   setTransfers(formattedTransfers)
  // }

  return (
    <div className="space-y-4 p-4">
      {/* <input
        type="text"
        placeholder="Buscar transferências por nome ou data"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 rounded bg-slate-400 text-white placeholder:text-white"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-amber-400 text-black rounded"
      >
        Buscar
      </button> */}

      {transfers.length > 0 && (
        <motion.div 
          initial={"hidden"}
          animate={"visible"}
          variants={itemVariants}
          className="space-y-3">
          {transfers.map((t) => (
            <div key={t.idPayment}className="bg-[var(--primary-brad-3)] p-4 rounded text-white space-y-1">
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
