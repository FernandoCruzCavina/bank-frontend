import { motion } from "motion/react"
import { useState } from "react"

export const ConfigModal = ({ animate }: { animate: "open" | "closed" }) => {
  const [form, setForm] = useState({
    nome: "João Silva",
    celular: "(11) 91234-5678",
    senhaAntiga: "",
    senhaNova: ""
  })

  const dadosFixos = {
    id: "USR123456",
    email: "joao@example.com",
    cpf: "123.456.789-00",
    nascimento: "1990-05-15",
    role: "USER"
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const atualizarDados = () => {
    // Aqui você faria a chamada para atualizar os dados
    console.log("Atualizando:", form)
  }

  const deletarConta = () => {
    // Aqui você faria a chamada para deletar a conta
    console.log("Conta deletada")
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
            value={form.nome}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3a3170] text-white"
          />
        </div>
        <div>
          <label>Celular:</label>
          <input
            type="text"
            name="celular"
            value={form.celular}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3a3170] text-white"
          />
        </div>
        <div>
          <label>Senha Atual:</label>
          <input
            type="password"
            name="senhaAntiga"
            value={form.senhaAntiga}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#3a3170] text-white"
          />
        </div>
        <div>
          <label>Nova Senha:</label>
          <input
            type="password"
            name="senhaNova"
            value={form.senhaNova}
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
