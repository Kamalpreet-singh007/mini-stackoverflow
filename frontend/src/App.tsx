import NavBar from './Components/navbar'
import ResponsePage from './Pages/responsePage'
import QuestionsPage from './Pages/questionPage'
import Home from './Pages/home'
import ProfilePage from './Pages/profilePage'
import AuthPage from "./Pages/authpage"
import { AuthContextProvider } from "./utills/auth";
import './App.css'
import { Route, Routes } from 'react-router-dom'
function App() {

  return (
    <>
    <AuthContextProvider>
    <NavBar/>
    <main className="main-content">
        <Routes>
          <Route path = "/login" element ={<AuthPage/>}/> 
          <Route path = "/" element ={<Home/>}/> 
          <Route path = "/profile" element = {<ProfilePage/>}/>
          <Route path = "/questions" element = {<QuestionsPage/>}/>
          <Route path = "/responses" element ={<ResponsePage/>}/> 

        </Routes>
    </main>
    </AuthContextProvider>
    
    </>
  )
}

export default App
