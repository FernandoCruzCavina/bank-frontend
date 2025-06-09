import { type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../services/authService'
import bradesco from '../../assets/bradesco-vertical-w.png';
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

    if(email === undefined || password === undefined) return

    const response = await login({
      email: email,
      password: password 
    })
    console.log(response)
    const {token, refreshToken} = response
    console.log(token)

    localStorage.removeItem('token')
    localStorage.removeItem('refresh')
    localStorage.setItem('token', token)
    localStorage.setItem('refresh', refreshToken)

    navigate('/')
  }

  return (
    <form onSubmit={loginUser} className='my-10 mx-10 space-y-5 rounded-2xl text-center'>
        <div className='flex flex-col justify-center items-center space-y-2'>
          <img src={bradesco} className="w-auto h-20 scale-200 fill-neutral-50 " />
          <p className='text-cyan-50 font-bold text-3xl'>Login</p>
        </div>
        <div className='space-y-1'>
          <div className='space-y-1 flex flex-col justify-items-start text-start'>
              <p className='text-slate-200 font-bold'>Email</p>
              <input className='bg-slate-700 hover:outline-2 outline-amber-400 placeholder:text-slate-300 text-white p-2 rounded' type="email" name='email' placeholder='email' />
          </div>
          <div className='space-y-1 flex flex-col justify-items-start text-start'>
              <p className='text-slate-200 font-bold'>Senha</p>
              <input className='bg-slate-700 hover:outline-2 outline-amber-400 placeholder:text-slate-300 text-white p-2 rounded' type="password" name='password' placeholder='password' />
          </div>
          <button className='flex w-full hover:underline text-slate-200' onClick={()=>{closeLogin()}}>Não tem uma conta?</button>
        </div>  
        <button type='submit' className='flex w-full justify-center bg-gradient-to-br from-[var(--primary-brad-2)] via-[var(--secundary-brad-1)] to-[var(--secundary-brad-1)] hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-sm shadow-2xl' >Login</button>
    </form>
  )
}

export default LogIn