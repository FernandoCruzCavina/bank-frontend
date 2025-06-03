import { motion } from "motion/react"
import { useState } from "react"
import { extract } from "../../services/paymentService"
import type { ViewPayment } from "../../types/dtos/payment/viewPayment"

const History = ({accountId}:{accountId: number | undefined}) => {
  const [query, setQuery] = useState("")
  const [transfers, setTransfers] = useState<ViewPayment[]>([])

  const handleSearch = async() => {
    const token = localStorage.getItem('token')

    if(token===null||accountId===undefined) return
    
    const payments = await extract(accountId, token)

    const formattedTransfers: ViewPayment[] = payments.map((payment) => ({
      id: payment.idPayment,
      receiver: payment.receiverAccount,
      sender: payment.senderAccount,
      amount: payment.amountPaid,
      date: payment.paymentCompletionDate,
      description: payment.paymentDescription
    }))

    setTransfers(formattedTransfers)
  }

  return (
    <div className="space-y-4 p-4">
      <input
        type="text"
        placeholder="Buscar transferências por nome ou data"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 rounded bg-[#3a3170] text-white"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-[#15F5BA] text-black rounded"
      >
        Buscar
      </button>

      {transfers.length > 0 && (
        <motion.div 
          initial={"hidden"}
          animate={"visible"}
          variants={itemVariants}
          className="space-y-3">
          {transfers.map((t) => (
            <div key={t.id}className="bg-[#463898] p-4 rounded text-white space-y-1">
              <p><strong>Enviador:</strong> {t.sender}</p>
              <p><strong>Destinatário:</strong> {t.receiver}</p>
              <p><strong>Valor:</strong> {t.amount}</p>
              <p><strong>Data:</strong> {t.date}</p>
              <p><strong>Descrição:</strong> {t.description}</p>
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
