import { motion } from "motion/react"
import { useState } from "react"
import type { Account } from "../../types/account"
import type { Pix } from "../../types/pix"
import { fetchPixByAccountId } from "../../services/pixService"
import { fetchAccountByPix } from "../../services/accountService"
import type { User } from "../../types/user"
import type { CreatePayment } from "../../types/dtos/payment/createPayment"
import { fetchUserByUserId } from "../../services/userService"
import type { SearchTargetPayment } from "../../types/dtos/search/searchTargetToPix"
import { usePaymentSocket } from "../../hooks/usePaymentSocket"
import { ConfirmModal } from "../../components/confirmModal"

interface PaymentProps{
  user: User | undefined
  account: Account | undefined
}

const Payment = ({user, account}: PaymentProps) => {
  const [pixKey, setPixKey] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [result, setResult] = useState<SearchTargetPayment|undefined>()
  const [pixTarget, setPixTarget] = useState<Pix|undefined>()
  const [userTarget, setUserTarget] = useState<User|undefined>()
  const [accountTarget, setAccountTarget] = useState<Account|undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState<boolean | null>(null)
  const [confirmData, setConfirmData] = useState<{ msg: string, onConfirm: () => void } | null>(null);
  const [respondFn, setRespondFn] = useState<((confirm: boolean) => void) | null>(null);
  const [webSocketReady, setWebSocketReady] = useState(false)
  const username = user?.username??"Guest"

  const { sendPaymentRequest } = usePaymentSocket((msg, respond) => {
    setConfirmData({
      msg,
      onConfirm: () => {
        respond(true)
        setConfirmData(null)
        setPaymentSuccess(true)
      },
    })
    setRespondFn(() => respond)
  }, username, webSocketReady)

  const handleSearch = async() => {

    const token = localStorage.getItem('token')
    if(token===null){return}

    const account = await fetchAccountByPix(pixKey, token)
    setAccountTarget(account)
    if (!account) {
      setPaymentError("Conta não encontrada.")
      return
    }
    
    const pix = await fetchPixByAccountId(account.idAccount, token ) 
    setPixTarget(pix)

    const user = await fetchUserByUserId(account.userModel, token)
    setUserTarget(user)
    
    setResult({user, account, pix})
  }

  const handlePayment = async () => {
    setPaymentError(null)
    setPaymentSuccess(null)

    try {
      if (!accountTarget?.idAccount || !pixTarget?.key) {
        throw new Error("Conta ou chave PIX inválida.")
      }

      setWebSocketReady(true)

      const createPayment: CreatePayment = {
        paymentDescription: `Pagamento via PIX para ${pixTarget.key}`,
        amountPaid: Number(paymentAmount),
        pixKey: pixTarget.key,
        idAccount: accountTarget.idAccount,
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
        placeholder="Buscar conta por nome, email ou número"
        value={pixKey}
        onChange={(e) => setPixKey(e.target.value)}
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
              className="w-full p-2 rounded bg-[#3a3170] text-white"
            />
            <button disabled={isLoading} onClick={()=>{handlePayment()}} className="w-full px-4 py-2 bg-[#15F5BA] text-black rounded">
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
      {confirmData && respondFn && (
        <ConfirmModal
          message={confirmData.msg}
          onConfirm={() => {
            respondFn(true);
            setConfirmData(null);
            setRespondFn(null);
          }}
          onCancel={() => {
            respondFn(false);
            setConfirmData(null);
            setRespondFn(null);
          }}
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