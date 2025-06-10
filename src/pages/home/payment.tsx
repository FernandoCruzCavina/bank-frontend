import { motion } from "motion/react"
import { useState } from "react"
import type { Account } from "../../types/account"
import type { Pix } from "../../types/pix"
import { fetchPixByAccountId } from "../../services/pixService"
import { fetchAccountByPix } from "../../services/accountService"
import type { User } from "../../types/user"
import type { RequestPayment } from "../../types/dtos/payment/requestPayment"
import { fetchUserByUserId } from "../../services/userService"
import type { SearchTargetPayment } from "../../types/dtos/search/searchTargetToPix"
import { usePaymentSocket } from "../../hooks/usePaymentSocket"
import { ConfirmModal } from "../../components/home-modal/confirmModal"

interface PaymentProps{
  user: User | undefined
  account: Account | undefined
}

const Payment = ({user, account}: PaymentProps) => {
  const [pixKey, setPixKey] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [result, setResult] = useState<SearchTargetPayment|undefined>()
  const [pixTarget, setPixTarget] = useState<Pix|undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState<boolean | null>(null)
  const [confirmData, setConfirmData] = useState<{ msg: string, onConfirm: () => void, onCancel: () => void} | null>(null);
  const [webSocketReady, setWebSocketReady] = useState(false)
  const username = user?.username??"Guest"

  const { sendPaymentRequest } = usePaymentSocket((msg, respond) => {
  setConfirmData({
    msg,
    onConfirm: () => {
      respond()
      setConfirmData(null)
      setPaymentSuccess(true)
    },
    onCancel: () => {
      setConfirmData(null)
      setPaymentError("Pagamento cancelado.")
    },
  })
}, username, webSocketReady)


  const handleSearch = async() => {

    const token = localStorage.getItem('token')
    if(token===null){return}

    const account = await fetchAccountByPix(pixKey, token)
    if (!account) {
      setPaymentError("Conta não encontrada.")
      return
    }
    
    const user = await fetchUserByUserId(account.userModel, token)
    if (!user) {
      setPaymentError("User não encontrada.")
      return
    }

    const pix = await fetchPixByAccountId(account.idAccount, token ) 
    setPixTarget(pix)
    if (!pix) {
      setPaymentError("Pix não encontrada.")
      return
    }

    setResult({user, account, pix})
  }

  const handlePayment = async () => {
    setPaymentError(null)
    setPaymentSuccess(null)

    try {
      if (!pixTarget?.key || !account) {
        throw new Error("Conta ou chave PIX inválida.")
      }

      setWebSocketReady(true)

      const createPayment: RequestPayment = {
        paymentDescription: `Pagamento via PIX para ${pixTarget.key}`,
        amountPaid: Number(paymentAmount),
        pixKey: pixTarget.key,
        idAccount: account.idAccount,
      }

      setTimeout(() => {
        sendPaymentRequest(createPayment)
        setIsLoading(true)
      }, 200)
    } catch (error) {
      console.error(error)
      setPaymentError("Erro ao iniciar o pagamento.")
    }
  }

  return (
    <div className="space-y-4 p-4">
      <input
        type="text"
        placeholder="Buscar por chave pix(E-mail, CPF, celular ou chave aleatória"
        value={pixKey}
        onChange={(e) => setPixKey(e.target.value)}
        className="w-full p-2 rounded bg-slate-400 text-white placeholder:text-white"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-amber-400 text-black rounded"
      >
        Buscar
      </button>

      {result && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={itemVariants}
          className="bg-[var(--primary-brad-1)] p-4 rounded text-white space-y-2"
        >
          <p><strong>Número da conta:</strong> {result?.account?.accountNumber}</p>
          <p><strong>Nome:</strong> {result?.user?.username}</p>
          <p><strong>Email:</strong> {result?.user?.email}</p>
          <p><strong>Data de Abertura:</strong> {result?.account?.createdAt}</p>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Valor da transferência"
              value={paymentAmount}
              onChange={(e)=>{setPaymentAmount(e.target.value)}}
              className="w-full p-2 rounded bg-slate-700 text-white placeholder:text-slate-300"
            />
            <button disabled={isLoading} onClick={()=>{handlePayment()}} className="w-full px-4 py-2 bg-amber-400 text-black rounded">
              Fazer Pagamento
            </button>
          </div>
        </motion.div>
      )}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#15F5BA]"></div>
            <p className="text-white text-xl font-semibold">Processando pagamento...</p>
          </motion.div>
        </motion.div>
      )}

      {paymentError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-red-400 mt-2 text-center"
        >
          {paymentError}
        </motion.div>
      )}
      {paymentSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-green-400 mt-2 text-center"
        >
          Pagamento realizado com sucesso!
        </motion.div>
      )}
      {confirmData && (
        <ConfirmModal
          message={confirmData.msg}
          onConfirm={confirmData.onConfirm}
          onCancel={confirmData.onCancel}
        />
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