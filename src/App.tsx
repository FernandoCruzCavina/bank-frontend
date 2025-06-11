import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/login/index.tsx'
import Home from './pages/home/index.tsx'
import { Toaster } from 'sonner'
import { ProtectedRoutes } from './utils/privateRoute.tsx'

function App() {

  return (
    <BrowserRouter>
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path='/login' element={<Login />} /> 
        
        <Route element={<ProtectedRoutes/>}>
          <Route path='/' element={<Home />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
