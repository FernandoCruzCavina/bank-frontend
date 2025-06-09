import { useState } from 'react'
import { motion} from 'motion/react'
import LogIn from './login'
import Signin from './signin'
import background from '../../assets/background-novidades.svg'

const Login = () => {

    const [isLogin, setLogin] = useState(true)

    const openLogin = () => {setLogin(true)}
    const closeLogin = () => {setLogin(false)}

    return (
        <div className='w-screen h-screen bg-[#ebebeb] flex justify-center place-items-center relative overflow-hidden'>
            <motion.div 
                className='bg-[var(--primary-brad-1)] rounded-lg flex justify-center z-10 shadow-2xl'
                initial={{ width: 300, height: 350 }}
                animate={isLogin ? { width: 400, height: 500 } : { width: 600, height: 700 }}
                transition={{ type: "spring",duration: 0.4 }}   
            >
                
                {isLogin ? (
                    <motion.div
                    key="login"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    >
                    <LogIn closeLogin={closeLogin} />
                    </motion.div>
                ) : (
                    <motion.div
                    key="signup"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    >
                    <Signin openLogin={openLogin} />
                    </motion.div>
                )}
                
            </motion.div>
            <img src={background}  className="absolute bottom-0 left-0 -translate-x-[-500px] z-0  w-[2000px] max-w-none pointer-events-none select-none -scale-100"/>
            <img src={background}  className="absolute top-0 left-0 z-0 -translate-x-160 w-[2000px] max-w-none pointer-events-none select-none"/>
        </div>
    )
}

export default Login