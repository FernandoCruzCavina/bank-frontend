import React, { type FormEvent } from 'react'
import { api } from '../../lib/axios'
import { useNavigate } from 'react-router-dom'

interface SigInProps{
    openLogin: ()=>void
}

const Singin = ({openLogin}:SigInProps) => {

  const siginUser= (event: FormEvent<HTMLFormElement>)=>{
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const username = data.get('username')?.toString()
    const email = data.get('email')?.toString()
    const password = data.get('password')?.toString()
    const confirmPassword = data.get('confirmPassword')?.toString()
    const phone = data.get('phone')?.toString()
    const cpf = data.get('cpf')?.toString()
    const birthdayDate = data.get('birthday')?.toString()

    if(!(password === confirmPassword)){
      console.log('erro')
      return
    }

    const response = api.post('/user', {

    })

    console.log(response)
    openLogin()
  }

  return (
    <form className='my-10 mx-10 bg-amber-400 space-y-12 rounded-2xl'>
        <h1 className='text-amber-50'>Sigin</h1>
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
            <button className=' hover:underline' onClick={()=>{openLogin()}}>não tem uma conta?</button>
            <button className='' onClick={()=>{siginUser}}>Login</button>
        </div>
    </form>
  )
}

export default Singin