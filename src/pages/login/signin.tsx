import { type FormEvent } from 'react'
import { createUser } from '../../services/userService'
import { toast } from 'sonner'
import bradesco from '../../assets/bradesco-vertical-w.png';
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
      toast.error("As senhas não coincidem", {
        description: "Verifique os campos de senha e confirme novamente.",
      })
      return
    }

    if(username === undefined || email === undefined || password === undefined 
      || phone === undefined || cpf === undefined || birthdayDate === undefined
    ) { 
      toast.error("Todos os campos não estão preenchidos", {
        description: "Verifique se todos os campos estão completos"
      })
      return
    }

    try {
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
      toast.success("Cadastrado com sucesso!")
    } catch (error: any) {
      console.error(error)
      toast.error('Erro no cadastro', {
        description: error.error.response.data.message || error
      })
    }
  }

  return (
    <form onSubmit={siginUser} className='flex flex-col my-10 space-y-5 rounded-2xl text-center'>
        <div className='flex flex-col justify-center items-center space-y-2'>
          <img src={bradesco} className="w-auto h-20 scale-200 fill-neutral-50 " />
          <p className='text-cyan-50 font-bold text-3xl'>Signin</p>
        </div>
        <div className='space-y-1'>
          <div className='flex space-x-2'>
            <div className='space-y-1 flex flex-col justify-items-start text-start'>
              <p className='text-slate-200 font-bold'>Nome de usuário</p>
              <input className='bg-slate-700 hover:outline-2 outline-amber-400 placeholder:text-slate-300 text-white flex p-2 rounded' type="text" name='username' placeholder='nome' />
            </div>
            <div className='space-y-1 flex flex-col justify-items-start text-start'>
                <p className='text-slate-200 font-bold'>Email</p>
                <input className='bg-slate-700 hover:outline-2 outline-amber-400 placeholder:text-slate-300 text-white p-2 rounded' type="email" name='email' placeholder='email' />
            </div>
          </div>
          <div className='space-y-1 flex flex-col justify-items-start text-start'>
              <p className='text-slate-200 font-bold'>Senha</p>
              <input className='bg-slate-700 hover:outline-2 outline-amber-400 placeholder:text-slate-300 text-white p-2 rounded' type="password" name='password' placeholder='password' />
          </div>
          <div className='space-y-1 flex flex-col justify-items-start text-start'>
              <p className='text-slate-200 font-bold'>Confirme a senha</p>
              <input className='bg-slate-700 hover:outline-2 outline-amber-400 placeholder:text-slate-300 text-white p-2 rounded' type="password" name='confirmPassword' placeholder='confirm password' />
          </div>
          <div className='space-y-1 flex flex-col justify-items-start text-start'>
              <p className='text-slate-200 font-bold'>Celular</p>
              <input className='bg-slate-700 hover:outline-2 outline-amber-400 placeholder:text-slate-300 text-white p-2 rounded' type="number" name='phone' placeholder='celular' />
          </div>
          <div className='flex space-x-2'>
            <div className='space-y-1 flex flex-col justify-items-start text-start'>
              <p className='text-slate-200 font-bold'>CPF</p>
              <input className='bg-slate-700 hover:outline-2 outline-amber-400 placeholder:text-slate-300 text-white p-2 rounded' type="number" name='cpf' placeholder='cpf' />
            </div>
            <div className='space-y-1 flex flex-col justify-items-start text-start'>
                <p className='text-slate-200 font-bold'>Data de nascimento</p>
                <input className='bg-slate-700 hover:outline-2 outline-amber-400 placeholder:text-slate-300 text-white p-2 rounded' type="date" name='birthday' placeholder='mm/dd/yyyy' />
            </div>
          </div>
          <button className='flex w-full hover:underline text-slate-200' onClick={()=>{openLogin()}}>Já tem uma conta?</button>
        </div>  
        <button type='submit' className='flex w-full justify-center bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-sm' >Signin</button>
    </form>
  )
}

export default Signin