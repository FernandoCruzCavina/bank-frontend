import { EyeClosedIcon, EyeIcon } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { deleteUser, updateUser } from "../../services/userService"
import type { Account } from "../../types/account"
import type { UpdateUser } from "../../types/dtos/user/updateUser"
import type { User } from "../../types/user"

interface ConfigModalProps{
  animate: "open" | "closed"
  user: User | undefined
  account: Account | undefined
  onUserUpdate: (updatedUser: User) => void
}

export const ConfigModal = ({ animate, user, account, onUserUpdate }: ConfigModalProps) => {
  const navigate = useNavigate()
  const [showSensitive, setShowSensitive] = useState(false)
  const [form, setForm] = useState({
    username: user?.username,
    phone: user?.phone,
    oldPassword: "",
    newPassword: ""
  })

  const fixData = {
    id: user?.id,
    email: user?.email,
    cpf: user?.cpf,
    nascimento: user?.birthdayDate,
    role: user?.userRole,

    accountNumber: account?.accountNumber,
    createdAt: account?.createdAt,
    lastUpdateAt: account?.lastUpdatedAt
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const updateData = async() => {
    console.log('component')
    const token = localStorage.getItem('token')

    if(form.username===undefined || form.phone===undefined || user?.id===undefined || token===null) return

    const newUser: UpdateUser = {
      username: form.username,
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
      phone: form.phone
    }
    try {
      user = await updateUser(user?.id, newUser, token)
      console.log("Atualizando:", form)
      onUserUpdate(user)
      toast("Atualizado com sucesso!", {
        description: "nome, telefone e senha"
      })
    } catch (error: any) {
      const responseError = error?.response?.data?.message || "Erro inesperado ao atualizar."
      toast.error(responseError)
    }
  }

  const deleteAccount = async() => {
    const token = localStorage.getItem('token')
    
    if(token===null || user?.id===undefined) return

    const deletedUser= await deleteUser(user?.id, token)

    if(deletedUser.id === user.id){
      console.log("Conta deletada")
      navigate('/login')
    } else {
      console.log('error')
    }
  }

  return (
    <motion.div
      animate={animate}
      variants={navVariants}
      className="absolute w-full h-screen flex flex-col justify-center ite p-16 overflow-y-auto text-white z-40"
    >
      <h2 className="text-4xl font-bold mb-12">Configurações</h2>
    
      <button
        onClick={() => setShowSensitive(!showSensitive)}
        className="flex self-center mb-2 px-3 py-1 bg-red-400 text-white rounded-4xl text-sm hover:bg-red-300"
      >
        {showSensitive ? <EyeIcon /> : <EyeClosedIcon />}
      </button>

      <motion.div variants={itemVariants} className={`${showSensitive ? '' : 'blur-xs select-none'} mb-6 space-y-2`}>
        {/* <p><strong>ID Usuário:</strong> {fixData.id}</p> */}
        <p><strong>Email:</strong> {fixData.email}</p>
        <p><strong>CPF:</strong> {fixData.cpf}</p>
        <p><strong>Nascimento:</strong> {fixData.nascimento}</p>
        <p><strong>Tipo de Conta:</strong> {fixData.role}</p>
        <p><strong>Número da Conta:</strong>{fixData.accountNumber}</p>
        <p><strong>Criação de conta:</strong>{fixData.createdAt}</p>
        <p><strong>Última atualização:</strong>{fixData.lastUpdateAt}</p>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4 mb-6">
        <div>
          <label>Nome:</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-400 text-white "
          />
        </div>
        <div>
          <label>Celular:</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-400 text-white"
          />
        </div>
        <div>
          <label>Senha Atual:</label>
          <input
            type="password"
            name="oldPassword"
            value={form.oldPassword}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-400 text-white"
          />
        </div>
        <div>
          <label>Nova Senha:</label>
          <input
            type="password"
            name="password"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full p-2 rounded bg-slate-400 text-white"
          />
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex justify-between gap-4 mt-8"
      >
        <button
          onClick={updateData}
          className="px-4 py-2 bg-[#15F5BA] text-black rounded hover:brightness-110"
        >
          Atualizar Dados
        </button>
        <button
          onClick={deleteAccount}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Deletar Conta
        </button>
      </motion.div>
    </motion.div>
  )
}

const navVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
}

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
  closed: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 }
  }
}

export default ConfigModal
