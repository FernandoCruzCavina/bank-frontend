import { Settings, UserCircle2, XIcon } from 'lucide-react'
import { AnimatePresence, useMotionValue, motion, useTransform, animate, type Variants } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import Payment from './payment'
import History from './history'
import ConfigModal from './configuration'

const Home = () => {
  const [isPayment, setPayment] = useState(true)
  const [isOpenConfig, setConfig] = useState(false)
  const [origin, setOrigin] = useState({ x: 0, y: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)
  const amount = useMotionValue(1)

  const rounded = useTransform(amount, (latest) => Math.round(latest).toString())
  const openPaymentModal =  ()=>{setPayment(true)}
  const closePaymentModal =  ()=>{setPayment(false)}
  useEffect(() => {
    const controls = animate(amount, 100, {
      duration: 4,
      ease: "easeInOut",
    })
    return controls.stop
  }, [amount])

  const toggleConfig = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      })
    }
    setConfig(prev => !prev)
  }

  return (
    <>
      <div className="w-screen h-[10vh] bg-[#7662fb] px-[50vh] relative z-10">
        <div className="flex justify-between items-center h-full">
          <div className="flex space-x-3 items-center">
            <button>
              <UserCircle2 />
            </button>
            <p>Nome</p>
          </div>

          <div className="flex z-50">
            <motion.button
              ref={btnRef}
              animate={{ rotate: isOpenConfig ? 90 : 0 }}
              transition={{ duration: 0.4 }}
              onClick={toggleConfig}
              className="flex bg-[#8f7dfd] p-2 rounded-full z-40"
            >
              {isOpenConfig ? <XIcon /> : <Settings />}
            </motion.button>
            
            <AnimatePresence>
              {isOpenConfig && (
                <div className="fixed inset-0 flex justify-center items-start  z-30 pointer-events-none">
                  
                  <div className="relative w-[50vw] h-screen overflow-hidden rounded-2xl pointer-events-auto shadow-2xl bg-transparent">
                    <motion.div
                      key="config-modal-bg"
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={getModalVariants(origin.x, origin.y)}
                      className="absolute inset-0 bg-[#8f7dfd]"
                    >
                      <ConfigModal animate="open" />
                    </motion.div>
                  </div>
                </div>)}
            </AnimatePresence>
            
          </div>
        </div>
      </div>

      <div className="w-screen h-[90vh] bg-[#2b2261] px-[50vh] space-y-4 relative z-0">
        <div className='flex justify-center py-2'>
          <p>R$</p>
          <motion.p className='text-4xl '>{rounded}</motion.p>
        </div>

        <div className="flex">
          <motion.button
            initial={false}
            animate={{ backgroundColor: isPayment ? "#7662fb" : "#463898" }}
            className="relative w-full"
            onClick={openPaymentModal}
          >
            transferência
            {isPayment && (
              <motion.div
                layoutId="underline"
                className="absolute top-6 w-full h-1 bg-[#15F5BA] rounded-2xl"
              />
            )}
          </motion.button>

          <motion.button
            initial={false}
            animate={{ backgroundColor: !isPayment ? "#7662fb" : "#463898" }}
            className="relative w-full"
            onClick={closePaymentModal}
          >
            histórico
            {!isPayment && (
              <motion.div
                layoutId="underline"
                className="absolute top-6 w-full h-1 bg-[#15F5BA] rounded-2xl"
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
            {isPayment ? <Payment /> : <History />}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}

const getModalVariants = (x: number, y: number): Variants => ({
  open: {
    clipPath: `circle(1600px at ${x - 380}px ${y}px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  },
  closed: {
    clipPath: `circle(25px at ${x -380}px ${y}px)`,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
})

export default Home
