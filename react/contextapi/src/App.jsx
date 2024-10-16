import { useState } from 'react'
import './App.css'
import UserContextProvider from './Context/UserContextProvider.jsx'
import Login from './Components/Login'
import Profile from './Components/Profile'

function App() {
 
  return (
    <>
    <UserContextProvider>
      <h1>Hello everyone , my name is bittu </h1>
      <Login/>
      <Profile/>
    </UserContextProvider>
    </>
  )
}

export default App
