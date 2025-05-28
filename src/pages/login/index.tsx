import React, { useState } from 'react'
import {motion, spring} from 'motion/react'
import LogIn from './login'
import Sigin from './sigin'

const Login = () => {

    const [isLogin, setLogin] = useState(true)

    const openLogin = () => {setLogin(true)}
    const closeLogin = () => {setLogin(false)}

    return (
        <div className='w-dvh h-dvh bg-gray-500 flex justify-center place-items-center'>
            <motion.div 
                className='bg-zinc-800 rounded-lg flex justify-center'
                initial={{ width: 300, height: 350 }}
                animate={isLogin ? { width: 400, height: 500 } : { width: 500, height: 600 }}
                transition={{ type: "spring",duration: 0.4 }}   
            >
                {isLogin? (
                    <LogIn closeLogin={closeLogin}/>
                ):( 
                    <Sigin openLogin={openLogin}/>
                )}
            </motion.div>
        </div>
    )
}

export default Login