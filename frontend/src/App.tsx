import NavBar from './Components/navbar'
import Search from './Pages/search'
import Home from './Pages/home'
import AuthPage from "./Pages/authpage"
import './App.css'
import { Route, Routes } from 'react-router-dom'
function App() {

  return (
    <>
    <NavBar/>
    <main className="main-content">
        <Routes>
          <Route path = "/login" element ={<AuthPage/>}/> 
          <Route path = "/search" element ={<Search/>}/> 

        </Routes>
    </main>
    
    </>
  )
}

export default App
