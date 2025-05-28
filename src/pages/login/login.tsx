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
    <form className='my-10 mx-10 bg-amber-400 space-y-12 rounded-2xl'>
        <h1 className='text-amber-50'>Login</h1>
        <div className='space-y-1'>
          <div className=' bg-amber-700 px-2 space-y-1 flex flex-col justify-items-start text-start'>
              <p>Nome</p>
              <input className='' type="email" name='email' placeholder='email' />
          </div>
          <div className=' bg-amber-700 px-2 space-y-1 flex flex-col justify-items-start text-start'>
              <p>nome</p>
              <input className='' type="password" name='password' placeholder='password' />
          </div>
        </div>
        <div className='flex flex-col space-y-2'>
            <button className=' hover:underline' onClick={()=>{closeLogin()}}>não tem uma conta?</button>
            <button className='' onClick={()=>{loginUser}}>Login</button>
        </div>
    </form>
  )
}

export default LogIn