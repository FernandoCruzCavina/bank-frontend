import React, { useState } from 'react'
import {AnimatePresence, motion, spring} from 'motion/react'
import LogIn from './login'
import Signin from './signin'

const Login = () => {

    const [isLogin, setLogin] = useState(true)

    const openLogin = () => {setLogin(true)}
    const closeLogin = () => {setLogin(false)}

    return (
        <div className='w-screen h-screen bg-[#2b2261] flex justify-center place-items-center'>
            <motion.div 
                className='bg-[#836FFF] rounded-lg flex justify-center'
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
        </div>
    )
}

export default Login