import { motion } from "motion/react"
import { useState } from "react"

const History = () => {
  const [query, setQuery] = useState("")
  const [transfers, setTransfers] = useState<any[]>([])

  const handleSearch = () => {
    setTransfers([
      {
        id: "tx001",
        to: "Maria Oliveira",
        amount: "R$ 500,00",
        date: "2025-05-29",
        status: "Concluída",
      },
      {
        id: "tx002",
        to: "Carlos Mendes",
        amount: "R$ 250,00",
        date: "2025-05-27",
        status: "Concluída",
      }
    ])
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
              <p><strong>ID:</strong> {t.id}</p>
              <p><strong>Destinatário:</strong> {t.to}</p>
              <p><strong>Valor:</strong> {t.amount}</p>
              <p><strong>Data:</strong> {t.date}</p>
              <p><strong>Status:</strong> {t.status}</p>
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
