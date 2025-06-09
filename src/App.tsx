import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/login/index.tsx'
import Home from './pages/home/index.tsx'
import { Toaster } from 'sonner'

function App() {

  return (
    <BrowserRouter>
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App
