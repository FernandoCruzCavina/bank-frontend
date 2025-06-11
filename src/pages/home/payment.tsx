import { requestSendPix, sendPix } from "@/services/paymentService"
import type { ConfirmCode } from "@/types/dtos/auth/confirmCode"
import { motion } from "motion/react"
import { useState } from "react"
import { toast } from "sonner"
import { ConfirmModal } from "../../components/home-modal/confirmModal"
import { fetchAccountByPix, fetchUserIdByAccountId } from "../../services/accountService"
import { fetchPixByAccountId } from "../../services/pixService"
import { fetchUserByUserId } from "../../services/userService"
import type { Account } from "../../types/account"
import type { SearchTargetPayment } from "../../types/dtos/search/searchTargetToPix"
import type { User } from "../../types/user"

interface PaymentProps{
  user: User | undefined
  account: Account | undefined
}

const Payment = ({user, account}: PaymentProps) => {
  const [pixKey, setPixKey] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [result, setResult] = useState<SearchTargetPayment | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState<boolean | null>(null)
  const [confirmData, setConfirmData] = useState<string | null>(null)
  const [inputCode, setInputCode] = useState<string | undefined>(undefined)
  
  const onCofirm = ()=>{
      handlePayment()
      setConfirmData(null)
      setPaymentSuccess(true)
  }
  const onCancel = ()=>{
    setConfirmData(null)
    setPaymentError("Pagamento cancelado.")
  } 

  const handleSearch = async() => {

    const token = localStorage.getItem('token')
    if(token===null){return}

    try {
      console.log("iam here")
      const account = await fetchAccountByPix(pixKey, token)
      console.log(account)
      const userId = await fetchUserIdByAccountId(account.idAccount, token)
      console.log(userId)
      const user= await fetchUserByUserId(userId , token)
      console.log(user)
      const pixs = await fetchPixByAccountId(account.idAccount, token ) 
      console.log(pixs)
      setResult({user, account, pixs})
    } catch (error: any) {
      toast.error('Conta não encontrada',{
        description: error.message || error
      })
    }
  }

  const analyzePayment = async()=>{
    const token = localStorage.getItem('token')
    if(!token || !result?.account || !user)return

    try {
      console.log(user.email)
      const response = await requestSendPix(result?.account?.idAccount, pixKey, user?.email, token)
      setConfirmData(response)
    } catch (error: any) {
      toast.error('Erro no pagamento')
    }
  }

  const handlePayment = async () => {
    setPaymentError(null)
    setPaymentSuccess(null)

    try {
      if (!result?.pixs || !account || !inputCode || !user) {
        throw new Error("Conta ou chave PIX inválida.")
      }

      const confirmCode: ConfirmCode = {
        idAccount: account.idAccount,
        pixKey: pixKey,
        code: inputCode,
        key: user?.email,
        paymentDescription: `Pagamento via PIX para ${result.user?.username}`,
        amountPaid: Number(paymentAmount),
      }
      setIsLoading(true)

      const response = await sendPix(confirmCode)

      setTimeout(() => {
        setIsLoading(false)
        setPaymentSuccess(true)
        console.log(response)
      }, 400)
    } catch (error) {
      console.error(error)
      setIsLoading(false)
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
              className="w-full p-2 rounded bg-slate-400 text-white placeholder:text-white"
            />
            <button disabled={isLoading} onClick={()=>{analyzePayment()}} className="w-full px-4 py-2 bg-amber-400 text-black rounded">
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
          message={confirmData}
          inputCode={inputCode}
          setInputCode={setInputCode}
          onConfirm={onCofirm}
          onCancel={onCancel}
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