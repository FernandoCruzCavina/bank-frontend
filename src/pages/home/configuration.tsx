import { motion } from "motion/react"
import { useState } from "react"
import type { User } from "../../types/user"
import { deleteUser, updateUser } from "../../services/userService"
import type { UpdateUser } from "../../types/dtos/user/updateUser"
import { useNavigate } from "react-router-dom"

interface ConfigModalProps{
  animate: "open" | "closed"
  user: User | undefined
}

export const ConfigModal = ({ animate, user }: ConfigModalProps) => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: user?.username,
    phone: user?.phone,
    oldPassword: "",
    newPassword: ""
  })

  const dadosFixos = {
    id: user?.id,
    email: user?.email,
    cpf: user?.cpf,
    nascimento: user?.birthdayDate,
    role: user?.userRole
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const atualizarDados = async() => {
    const token = localStorage.getItem('token')

    if(form.username===undefined || form.phone===undefined || user?.id===undefined || token===null) return

    const newUser: UpdateUser = {
      username: form.username,
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
      phone: form.phone
    }
    
    user = await updateUser(user?.id, newUser, token)
    console.log("Atualizando:", form)
  }

  const deletarConta = async() => {
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
      <h2 className="text-4xl font-bold mb-12">⚙️ Configurações</h2>

      <motion.div variants={itemVariants} className="mb-6 space-y-2">
        <p><strong>ID Usuário:</strong> {dadosFixos.id}</p>
        <p><strong>Email:</strong> {dadosFixos.email}</p>
        <p><strong>CPF:</strong> {dadosFixos.cpf}</p>
        <p><strong>Nascimento:</strong> {dadosFixos.nascimento}</p>
        <p><strong>Tipo de Conta:</strong> {dadosFixos.role}</p>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4 mb-6">
        <div>
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={form.username}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3a3170] text-white"
          />
        </div>
        <div>
          <label>Celular:</label>
          <input
            type="text"
            name="celular"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3a3170] text-white"
          />
        </div>
        <div>
          <label>Senha Atual:</label>
          <input
            type="password"
            name="senhaAntiga"
            value={form.oldPassword}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3a3170] text-white"
          />
        </div>
        <div>
          <label>Nova Senha:</label>
          <input
            type="password"
            name="senhaNova"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3a3170] text-white"
          />
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex justify-between gap-4 mt-8"
      >
        <button
          onClick={atualizarDados}
          className="px-4 py-2 bg-[#15F5BA] text-black rounded hover:brightness-110"
        >
          Atualizar Dados
        </button>
        <button
          onClick={deletarConta}
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
