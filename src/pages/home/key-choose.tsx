import { createPix, deletePixByPixId, fetchAllPixFromAccountByAccountId, updatePix } from '@/services/pixService'
import type { Account } from '@/types/account'
import type { Pix } from '@/types/pix'
import { Check, Pencil, Trash2Icon, XIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { toast } from 'sonner'

interface KeyChooseModalProps {
  animate: 'open' | 'closed',
  account: Account | undefined,
  pix: Pix[] | undefined
  refreshPix: (pix: Pix[])=>void
}

const KeyChooseModal = ({ animate, account, pix, refreshPix }: KeyChooseModalProps) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [step, setStep] = useState<1 | 2>(1)
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingPixId, setEditingPixId] = useState<number | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [editingType, setEditingType] = useState('')

  const handleSelect = (value: string) => {
    setSelectedKey(prev => prev === value ? null : value)
  }

  const deleteKey = async (pixId: number) => {
    const token = localStorage.getItem('token')
    if (!token || !account) return

    try {
      const message = await deletePixByPixId(account?.idAccount, pixId, token)
      toast('Chave deletada', { description: message })
    } catch (error: any) {
      toast.error("Erro ao deletar chave", { description: error.message || error })
    }
  }

  const handleContinue = () => {
    if (!selectedKey) return
    setStep(2)
  }

  const registerKey = async () => {
    const token = localStorage.getItem('token')
    if (!token || !account || !inputValue || !selectedKey ) {
        console.log(token)
        console.log(account)
        console.log(inputValue)
        console.log('stop here')
        return
    }

    try {
      setLoading(true)
      const response = await createPix(account.idAccount, inputValue, selectedKey.toUpperCase(), token)
      console.log(response)
      toast.success('Chave registrada com sucesso', {
        description: 'A chave foi criada com sucesso.',
      })

      const pixAll = await fetchAllPixFromAccountByAccountId(account.idAccount, token)
      if(!pixAll)return
      refreshPix(pixAll)

      setInputValue('')
      setSelectedKey(null)
      setStep(1)
    } catch (error: any) {
      toast.error('Erro ao registrar chave', {
        description: error.message || error
      })
    } finally {
      setLoading(false)
    }
  }
  const updateKey = async (pixId: number) => {
    const token = localStorage.getItem('token')
    if (!token || !account) return

    try {
        setLoading(true)
        await updatePix(account.idAccount, editingValue,  pixId, editingType.toUpperCase(), token)

        toast.success('Chave atualizada com sucesso', {
        description: 'A chave foi alterada.',
        })

        const pixAll = await fetchAllPixFromAccountByAccountId(account.idAccount, token)
        if(!pixAll)return
        refreshPix(pixAll)
        setEditingPixId(null)
        setEditingValue('')
    } catch (error: any) {
        toast.error('Erro ao atualizar chave', {
        description: error.message || error
        })
    } finally {
        setLoading(false)
    }
  }


  return (
    <motion.div
      animate={animate}
      variants={navVariants}
      className="absolute w-full h-screen flex flex-col justify-center p-16 overflow-y-auto text-white z-40 bg-red-400"
    >
      {step === 1 ? (
        <>
          <h2 className="text-4xl font-bold mb-12">Qual chave você quer cadastrar?</h2>

          <motion.div variants={itemVariants} className="mb-6 space-y-2">
            <p className='text-2xl font-bold text-red-50'>Chave Pix</p>
            <p>Pode ser cadastrada com dados de celular, e-mail ou CPF e esses dados aparecem no extrato.</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mb-6 space-y-2">
            <p className='text-2xl font-bold text-red-50'>Chave aleatória</p>
            <p>Ele é composta por um código de letras e números que você não precisa anotar nem decorar.</p>
          </motion.div>

          <div className="flex flex-wrap gap-32 mb-6">
            <motion.div variants={itemVariants} className='space-y-5'>
              <p className='text-2xl font-bold text-red-50'>Selecione uma chave</p>
              {['Celular', 'Email', 'Chave Aleatória', 'CPF'].map((key) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedKey === key}
                    onChange={() => handleSelect(key)}
                    className="hidden peer"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 ${selectedKey === key ? 'bg-blue-500 border-blue-500' : 'border-gray-900'}`} />
                  <span>{key}</span>
                </label>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className='space-y-5'>
              <p className='text-2xl font-bold text-red-50'>Chaves atuais</p>
              {pix?.length ? (
                <ul className="space-y-3">
                    {pix.map((k) => (
                    <li
                        key={k.idPix}
                        className="flex items-center justify-between bg-white/10 px-4 py-2 rounded gap-4"
                    >
                        {editingPixId === k.idPix ? (
                        <input
                            type="text"
                            value={editingValue}
                            onChange={e => setEditingValue(e.target.value)}
                            className="text-black p-1 rounded flex-1"
                        />
                        ) : (
                        <span>{k.keyType}: {k.key}</span>
                        )}

                        {editingPixId === k.idPix ? (
                        <button
                            onClick={() => updateKey(k.idPix)}
                            disabled={loading || !editingValue}
                            className="bg-green-500 px-2 py-1 rounded hover:bg-green-600"
                        >
                            <Check />
                        </button>
                        ) : (
                        <button
                            onClick={() => {
                            setEditingPixId(k.idPix)
                            setEditingValue(k.key)
                            setEditingType(k.keyType)
                            }}
                            className="bg-pink-600 px-2 py-1 rounded hover:bg-pink-700"
                        >
                            <Pencil />
                        </button>
                        )}

                        {editingPixId === k.idPix? (
                          <button
                            onClick={() => setEditingPixId(null)}
                            className="bg-red-600 px-2 py-1 rounded hover:bg-red-700"
                            >
                            <XIcon />
                          </button>
                        ) : (
                          <button
                            onClick={() => deleteKey(k.idPix)}
                            className="bg-red-600 px-2 py-1 rounded hover:bg-red-700"
                            >
                            <Trash2Icon />
                          </button>
                        )}
                    </li>
                    ))}
                </ul>
                ) : (
                <p className="text-slate-300">Nenhuma chave cadastrada</p>
                )}

            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="flex justify-between gap-4 mt-8"
          >
            <button
              onClick={handleContinue}
              disabled={!selectedKey}
              className={`px-4 py-2 rounded text-black ${selectedKey ? 'bg-[#15F5BA] hover:brightness-110' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Continuar
            </button>
          </motion.div>
        </>
      ) : (
        <>
          <h2 className="text-4xl font-bold mb-8">{selectedKey}</h2>
          <motion.div variants={itemVariants} className="space-y-4">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder={`Digite seu ${selectedKey?.toLowerCase()}`}
              className="w-full p-4 rounded text-black"
            />

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Voltar
              </button>
              <button
                onClick={registerKey}
                disabled={!inputValue || loading}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Salvar'}
              </button>
            </div>
          </motion.div>
        </>
      )}
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

export default KeyChooseModal
