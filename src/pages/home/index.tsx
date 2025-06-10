import { fetchAllPixFromAccountByAccountId } from '@/services/pixService'
import type { Pix } from '@/types/pix'
import { KeyIcon, Settings, UserCircle2, XIcon } from 'lucide-react'
import { animate, AnimatePresence, motion, useMotionValue, useTransform, type Variants } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import bradesco from '../../assets/logo-mobile.svg'
import { fetchAccountByUserId } from '../../services/accountService'
import { fetchUserByToken } from '../../services/userService'
import type { Account } from '../../types/account'
import type { User } from '../../types/user'
import ConfigModal from './configuration'
import History from './history'
import KeyChoose from './key-choose'
import Payment from './payment'

const Home = () => {
  const [user, setUser] = useState<User>()
  const [account, setAccount] = useState<Account>()
  const [pix, setPix] = useState<Pix[]>()
  const [isPayment, setPayment] = useState(true)
  const [isOpenConfig, setConfig] = useState(false)
  const [isOpenKeyChoose, setKeyChoose] = useState(false)

  const [origin, setOrigin] = useState({ x: 0, y: 0 })
  const [originConfig, setOriginConfig] = useState({ x: 0, y: 0 })
  const [originKeyChoose, setOriginKeyChoose] = useState({ x: 0, y: 0 })

  const btnRefConfig = useRef<HTMLButtonElement>(null)
  const btnRefKeyChoose = useRef<HTMLButtonElement>(null)
  const amount = useMotionValue(0)
  const rounded = useTransform(amount, (latest) => Math.round(latest).toString())
  
  const openPaymentModal =  ()=>{setPayment(true)}
  const closePaymentModal =  ()=>{setPayment(false)}
  const refreshPix = (pix: Pix[])=>{setPix(pix)}

  const handleUserUpdate = (updatedUser: User) => {setUser(updatedUser)}

  
  useEffect(() => {
    if (account?.balance !== undefined) {
      const controls = animate(amount, account.balance, {
        duration: 1.5,
        ease: "easeInOut",
      })
      return () => controls.stop()
    }
  }, [account?.balance])

  useEffect(() => {
    if (account?.balance !== undefined) {
    amount.set(account.balance)
    }
  }, [account, amount])

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      const user = await fetchUserByToken(token)
      setUser(user)
      const account = await fetchAccountByUserId(user.id, token)
      setAccount(account)
      const pix = await fetchAllPixFromAccountByAccountId(account.idAccount, token);
      setPix(pix)
      console.log(account)
      console.log(user)
      console.log(pix)
    }

  init()
  }, [])

  const toggleConfig = () => {
    if (btnRefConfig.current) {
      const rect = btnRefConfig.current.getBoundingClientRect()
      setOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      })
    }
    setConfig(prev => !prev)
  }
  const toggleKeyChoose = () => {
    if (btnRefKeyChoose.current) {
      const rect = btnRefKeyChoose.current.getBoundingClientRect()
      setOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      })
    }
    setKeyChoose(prev => !prev)
  }

  return (
    <>
      <div className="w-screen h-[10vh] bg-[var(--primary-brad-1)] px-[50vh]  z-10">
        <div className="flex flex-col h-full">
          <div className='flex pt-2'>
            <img src={bradesco} alt="" />
          </div>
          <div className='flex justify-between items-center h-full'>
            <div className="flex space-x-3 items-center">
              <div className='text-red-50'>
                <UserCircle2 />
              </div>
              <p className='text-white font-bold'>{user?.username}</p>
            </div>

            <div className="flex z-50">
              <motion.button
                ref={btnRefKeyChoose}
                animate={{ rotate: isOpenKeyChoose? 90 : 0 }}
                onClick={toggleKeyChoose}
                variants={getModalVariants(originConfig.x, originConfig.y)}
                className='flex bg-red-400 p-2 rounded-full z-40 text-red-50 mr-4'
              >
                {isOpenKeyChoose? <XIcon /> : <KeyIcon />}
              </motion.button>
              <motion.button
                ref={btnRefConfig}
                animate={{ rotate: isOpenConfig ? 90 : 0 }}
                onClick={toggleConfig}
                variants={getModalVariants(originKeyChoose.x, originKeyChoose.y)}
                className="flex bg-red-400 p-2 rounded-full z-40 text-red-50"
              >
                {isOpenConfig ? <XIcon /> : <Settings />}
              </motion.button>
              
              <AnimatePresence>
                {isOpenConfig && (
                  <div className="fixed inset-0 flex justify-center items-start z-30 pointer-events-none">   
                    <div className="relative w-[50vw] h-screen overflow-hidden rounded-2xl pointer-events-auto shadow-2xl bg-transparent">
                      <motion.div
                        key="config-modal-bg"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={getModalVariants(origin.x, origin.y)}
                        className="absolute inset-0 bg-red-400"
                      >
                        <ConfigModal animate="open" user={user} account={account} onUserUpdate={handleUserUpdate}/>
                      </motion.div>
                    </div>
                  </div>)}
              </AnimatePresence>
              <AnimatePresence>
                {isOpenKeyChoose && (
                  <div className="fixed inset-0 flex justify-center items-start z-30 pointer-events-none">   
                    <div className="relative w-[50vw] h-screen overflow-hidden rounded-2xl pointer-events-auto shadow-2xl bg-transparent">
                      <motion.div
                        key="keyChoose-modal-bg"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={getModalVariants(origin.x, origin.y)}
                        className="absolute inset-0 bg-red-400"
                      >
                        <KeyChoose animate="open" account={account} pix={pix} refreshPix={refreshPix}/>
                      </motion.div>
                    </div>
                  </div>)}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="w-screen h-[90vh] bg-white px-[50vh] space-y-4 relative z-0">
        <div className='flex justify-center py-2'>
          <p className='text-slate-950'>R$</p>
          <motion.p className='text-4xl text-slate-950 '>{rounded}</motion.p>
        </div>

        <div className="flex">
          <motion.button
            initial={false}
            animate={{ backgroundColor: isPayment ? "var(--primary-brad-1)" : "var(--primary-brad-2)" }}
            className="relative w-full text-red-50"
            onClick={openPaymentModal}
          >
            transferência
            {isPayment && (
              <motion.div
                layoutId="underline"
                className="absolute top-6 w-full h-1 bg-amber-400 rounded-2xl"
              />
            )}
          </motion.button>

          <motion.button
            initial={false}
            animate={{ backgroundColor: !isPayment ? "var(--primary-brad-1)" : "var(--primary-brad-2)" }}
            className="relative w-full text-red-50"
            onClick={closePaymentModal}
          >
            histórico
            {!isPayment && (
              <motion.div
                layoutId="underline"
                className="absolute top-6 w-full h-1 bg-amber-400 rounded-2xl"
              />
            )}
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isPayment ? "payment" : "history"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isPayment ? <Payment account={account} user={user}/> : <History accountId={account?.idAccount}/>}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}

const getModalVariants = (x: number, y: number): Variants => {
  const modalLeft = window.innerWidth * 0.25
  const relativeX = x - modalLeft

  return {
    open: {
      clipPath: `circle(1600px at ${relativeX}px ${y}px)`,
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2,
      },
    },
    closed: {
      clipPath: `circle(25px at ${relativeX}px ${y}px)`,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  }
}

export default Home
