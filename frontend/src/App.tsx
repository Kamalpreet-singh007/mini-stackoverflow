import NavBar from './Components/navbar'
import ResponsePage from './Pages/responsePage'
import QuestionsPage from './Pages/questionPage'
import Home from './Pages/home'
import ProfilePage from './Pages/profilePage'
import AuthPage from "./Pages/authpage"
import QuestionDescriptionPage from "./Pages/questiondescrptionPage"
import { AuthContextProvider } from "./utills/auth";
import {QuestionContextProvider} from "./utills/question"
import './App.css'
import { Route, Routes } from 'react-router-dom'
function App() {

  return (
    <>
    <AuthContextProvider>
      <QuestionContextProvider>
    <NavBar/>
    <main className="main-content">
        <Routes>
          <Route path = "/login" element ={<AuthPage/>}/> 
          <Route path = "/" element ={<Home/>}/> 
          <Route path = "/profile" element = {<ProfilePage/>}/>
          <Route path = "/questions" element = {<QuestionsPage/>}/>
          <Route path = "/responses" element ={<ResponsePage/>}/> 
          <Route path = "/question/:id" element ={<QuestionDescriptionPage/>}/> 


        </Routes>
    </main>
        </QuestionContextProvider>
    </AuthContextProvider>
    
    </>
  )
}

export default App
