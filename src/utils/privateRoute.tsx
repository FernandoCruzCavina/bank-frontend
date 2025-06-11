import {Outlet, Navigate} from 'react-router-dom'

export const ProtectedRoutes = () => {
    const jwt = localStorage.getItem('token') || null
 
    return jwt ? <Outlet/> : <Navigate to='/login'/>
}