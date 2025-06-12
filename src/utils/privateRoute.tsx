import { useEffect, useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { getTokenFromRefreshToken } from '@/services/authService'
import { motion } from 'motion/react'

function isJwtValid(token: string | null): boolean {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false

  try {
    const payload = JSON.parse(atob(parts[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp && payload.exp > currentTime
  } catch {
    return false
  }
}

export const ProtectedRoutes = () => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      const refresh = localStorage.getItem('refresh')

      if (isJwtValid(token)) {
        setIsAuth(true)
        return
      }

      if (refresh) {
        try {
          const newToken = await getTokenFromRefreshToken(refresh) 
          localStorage.setItem('token', newToken)
          setIsAuth(true)
        } catch (err) {
          console.error('Erro ao renovar token:', err)
          localStorage.removeItem('token')
          localStorage.removeItem('refresh')
          setIsAuth(false)
        }
      } else {
        setIsAuth(false)
      }
    }
    checkAuth()
  }, [])

  if (isAuth === null) return (
    <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[var(--primary-brad-3)]"></div>
            <p className="text-white text-xl font-semibold">Carregando...</p>
          </motion.div>
        </motion.div>
  )

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />
}