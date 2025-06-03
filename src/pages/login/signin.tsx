import React, { type FormEvent } from 'react'
import { api } from '../../lib/axios'
import { createUser } from '../../services/userService'
interface SigninProps{
    openLogin: ()=>void
}

const Signin = ({openLogin}:SigninProps) => {

  const siginUser= async (event: FormEvent<HTMLFormElement>)=>{
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

    if(username === undefined || email === undefined || password === undefined 
      || phone === undefined || cpf === undefined || birthdayDate === undefined
    ) { 
      console.log('undefined') 
      return
    }

    const response = await createUser({
      username: username,
      email: email,
      password: password,
      phone: phone,
      cpf: cpf,
      birthdayDate: birthdayDate
    })

    console.log(response)
    openLogin()
  }

  return (
    <form onSubmit={siginUser} className='flex flex-col my-10 space-y-12 rounded-2xl text-center'>
        <h1 className='text-cyan-50'>Signin</h1>
        <div className='space-y-1'>
          <div className='flex space-x-2'>
            <div className='space-y-1 flex flex-col justify-items-start text-start'>
              <p className='text-[#15F5BA]'>Nome de usuário</p>
              <input className='bg-slate-700 hover:outline outline-[#15F5BA] placeholder:text-[#5ec6aa] text-white flex p-2 rounded' type="text" name='username' placeholder='nome' />
            </div>
            <div className='space-y-1 flex flex-col justify-items-start text-start'>
                <p className='text-[#15F5BA]'>Email</p>
                <input className='bg-slate-700 hover:outline outline-[#15F5BA] placeholder:text-[#5ec6aa] text-white p-2 rounded' type="email" name='email' placeholder='email' />
            </div>
          </div>
          <div className='space-y-1 flex flex-col justify-items-start text-start'>
              <p className='text-[#15F5BA]'>Senha</p>
              <input className='bg-slate-700 hover:outline outline-[#15F5BA] placeholder:text-[#5ec6aa] text-white p-2 rounded' type="password" name='password' placeholder='password' />
          </div>
          <div className='space-y-1 flex flex-col justify-items-start text-start'>
              <p className='text-[#15F5BA]'>Confirme a senha</p>
              <input className='bg-slate-700 hover:outline outline-[#15F5BA] placeholder:text-[#5ec6aa] text-white p-2 rounded' type="password" name='confirmPassword' placeholder='confirm password' />
          </div>
          <div className='space-y-1 flex flex-col justify-items-start text-start'>
              <p className='text-[#15F5BA]'>Celular</p>
              <input className='bg-slate-700 hover:outline outline-[#15F5BA] placeholder:text-[#5ec6aa] text-white p-2 rounded' type="number" name='phone' placeholder='celular' />
          </div>
          <div className='flex space-x-2'>
            <div className='space-y-1 flex flex-col justify-items-start text-start'>
              <p className='text-[#15F5BA]'>CPF</p>
              <input className='bg-slate-700 hover:outline outline-[#15F5BA] placeholder:text-[#5ec6aa] text-white p-2 rounded' type="number" name='cpf' placeholder='cpf' />
            </div>
            <div className='space-y-1 flex flex-col justify-items-start text-start'>
                <p className='text-[#15F5BA]'>Data de nascimento</p>
                <input className='bg-slate-700 hover:outline outline-[#15F5BA] placeholder:text-[#5ec6aa] text-white p-2 rounded' type="date" name='birthday' placeholder='mm/dd/yyyy' />
            </div>
          </div>
          <button className='flex w-full hover:underline' onClick={()=>{openLogin()}}>Já tem uma conta?</button>
        </div>  
        <button type='submit' className='flex w-full justify-center bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-sm' >Login</button>
    </form>
  )
}

export default Signin