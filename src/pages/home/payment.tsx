import { requestSendPix, sendPix, sendPixDirect } from "@/services/paymentService"
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
import type { CreatePayment } from "@/types/dtos/payment/createPayment"
import type { paymentAnalyzeDto } from "@/types/dtos/payment/requestPayment"
import { formatAccountDates, formatDate } from "@/utils/formattedDate"

interface PaymentProps{
  user: User | undefined
  account: Account | undefined
}

const Payment = ({user, account}: PaymentProps) => {
  const [pixKey, setPixKey] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [result, setResult] = useState<SearchTargetPayment | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [confirmData, setConfirmData] = useState<string | null>(null)
  const [codeModal, setCodeModal] = useState<boolean | null>(null)
  const [inputCode, setInputCode] = useState<string | undefined>(undefined)
  
  const onConfirm = ()=>{
      codeModal ? paymentWithCode() : paymentWithoutCode()
      setCodeModal(null)
      setConfirmData(null)
  }
  const onCancel = ()=>{
    setCodeModal(null)
    setConfirmData(null)
  } 

  const handleSearch = async() => {

    const token = localStorage.getItem('token')
    if(token===null){return}

    try {
      const account = await fetchAccountByPix(pixKey, token)
      const userId = await fetchUserIdByAccountId(account.idAccount, token)
      const user= await fetchUserByUserId(userId , token)
      const pixs = await fetchPixByAccountId(account.idAccount, token )
      setResult({user, account, pixs})
    } catch (error: any) {
      toast.error('Conta não encontrada',{
        description: error.response.data.message || error
      })
    }
  }

  const analyzePayment = async()=>{
    const token = localStorage.getItem('token')
    if(!token || !result?.account || !user)return

    try {
      const paymentAnalyzeDto: paymentAnalyzeDto = {
        amountPaid: Number(paymentAmount),
        paymentDescription: `Pagamento via PIX para ${result.user?.username}`,
        email: user.email
      }
      
      const response = await requestSendPix(result?.account?.idAccount, pixKey, paymentAnalyzeDto, token)
      
      if(response === "Você realmente deseja fazer esse pagamento?"){
        setCodeModal(false)
        setConfirmData(response)
        return
      }
      setCodeModal(true)
      setConfirmData(response)
    } catch (error: any) {
      toast.error('Erro no pagamento', {description: error.response.data.message || error})
    }
  }

  const paymentWithoutCode = async () => {
    setIsLoading(true)

    try {
      const token = localStorage.getItem('token')
      if(!token || !result?.pixs || !result.user || !account){
        throw new Error("Conta ou chave PIX inválida.")
      }

      const paymentDto: CreatePayment = {
        amountPaid: Number(paymentAmount),
        paymentDescription: `Pagamento via PIX para ${result.user?.username}`
      }

      const response = await sendPixDirect(account?.idAccount, result.pixs[1].key, paymentDto, token)

      toast.success('Pagamento Realizado', {description: response})

    } catch (error: any) {
      console.error(error)
      toast.error('Erro no pagamento', {description: error.response.data.message || error})
    } finally {
      setIsLoading(false)
    }
  } 


  const paymentWithCode = async () => {
    setIsLoading(true)

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

      const response = await sendPix(confirmCode)

      setTimeout(() => {
        toast('Pagamento realizado', {description: response})
      }, 400)
    } catch (error: any) {
      console.error(error)
      toast.error('Erro ao iniciar o pagamento.', {description: error.response.data.message || error})
    } finally {
      setIsLoading(false)
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
          <p><strong>Nome:</strong> {result?.user?.username}</p>
          <p><strong>Email:</strong> {result?.user?.email}</p>
          <p><strong>Data de Abertura:</strong>{" "}{result.account?.createdAt ? formatDate(result.account.createdAt) : "Não disponível"}</p>
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[var(--primary-brad-3)]"></div>
            <p className="text-white text-xl font-semibold">Processando pagamento...</p>
          </motion.div>
        </motion.div>
      )}
      {codeModal !== null && (
        <ConfirmModal
          message={confirmData}
          inputCode={inputCode}
          codeModal={codeModal}
          setInputCode={setInputCode}
          onConfirm={onConfirm}
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