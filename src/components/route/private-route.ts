// import { type ReactNode } from 'react'
// import { typeof Navigate } from 'react-router-dom'

// interface PrivateRouteProps {
//   children: ReactNode
// }

// export const PrivateRoute = ({ children }: PrivateRouteProps) => {
//   const token = localStorage.getItem('token')

//   if (!token) {
//     return <Navigate to="/login" replace />
//   }

//   return <>{children}</>
// }