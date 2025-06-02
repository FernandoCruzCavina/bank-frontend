// Payment.tsx
import { motion } from "motion/react"
import { useState } from "react"
import { api } from "../../lib/axios"

const Payment = () => {
  const [query, setQuery] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("");
  const [result, setResult] = useState<any>(null)

  const handleSearch = async() => {

    const response = await api.get(`/account/accounts/${query}`)

    

    setResult({
      userId: "123456",
      accountId: "acc789",
      openedAt: "2023-04-01",
      userName: "João Silva",
      email: "joao@example.com",
      accountNumber: "000123456789",
      balance: "R$ 3.200,00",
      status: "Ativa"
    })
  }

  function handlePayment(amount: number) {
    throw new Error("Function not implemented.")
  }

  return (
    <div className="space-y-4 p-4">
      <input
        type="text"
        placeholder="Buscar conta por nome, email ou número"
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

      {result && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={itemVariants}
          className="bg-[#463898] p-4 rounded text-white space-y-2"
        >
          <p><strong>Número da conta:</strong> {result.accountId}</p>
          <p><strong>Nome:</strong> {result.userName}</p>
          <p><strong>Email:</strong> {result.email}</p>
          <p><strong>Data de Abertura:</strong> {result.openedAt}</p>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Valor da transferência"
              value={paymentAmount}
              onChange={(e)=>{setPaymentAmount(e.target.value)}}
              className="w-full p-2 rounded bg-[#3a3170] text-white"
            />
            <button onClick={()=>{handlePayment(Number(paymentAmount))}} className="w-full px-4 py-2 bg-[#15F5BA] text-black rounded">
              Fazer Pagamento
            </button>
          </div>
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

export default Payment