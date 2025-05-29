import React, { type FormEvent } from 'react'
import { api } from '../../lib/axios'
import { useNavigate } from 'react-router-dom'
interface LogInProps{
    closeLogin: ()=> void
}

const LogIn = ({closeLogin}:LogInProps) => {

  const navigate = useNavigate()

  const loginUser = async(event: FormEvent<HTMLFormElement>)=>{
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const email = data.get('email')?.toString()
    const password = data.get('password')?.toString()

    const response = await api.post('/auth/login',{
      'email': email,
      'password': password 
    })

    const token = response.data
    console.log(token)

    localStorage.removeItem('token')
    localStorage.setItem('token', token)

    navigate('/')
  }

  return (
    <form onSubmit={loginUser} className='my-10 mx-10 space-y-12 rounded-2xl text-center'>
        <h1 className='text-cyan-50'>Login</h1>
        <div className='space-y-1'>
          <div className='space-y-1 flex flex-col justify-items-start text-start'>
              <p className='text-[#15F5BA]'>Email</p>
              <input className='bg-slate-700 hover:outline outline-[#15F5BA] placeholder:text-[#5ec6aa] text-white p-2 rounded' type="email" name='email' placeholder='email' />
          </div>
          <div className='space-y-1 flex flex-col justify-items-start text-start'>
              <p className='text-[#15F5BA]'>Senha</p>
              <input className='bg-slate-700 hover:outline outline-[#15F5BA] placeholder:text-[#5ec6aa] text-white p-2 rounded' type="password" name='password' placeholder='password' />
          </div>
          <button className='flex w-full hover:underline' onClick={()=>{closeLogin()}}>Não tem uma conta?</button>
        </div>  
        <button type='submit' className='flex w-full justify-center bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-sm' >Login</button>
    </form>
  )
}

export default LogIn