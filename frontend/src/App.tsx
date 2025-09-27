import NavBar from './Components/navbar';
import ResponsePage from './Pages/responsePage';
import QuestionsPage from './Pages/questionPage';
import Home from './Pages/home';
import ProfilePage from './Pages/profilePage';
import Update from './Pages/updatePage';
import AuthPage from './Pages/authpage';
import AskQuestionPage from './Pages/askPage';
import QuestionDescriptionPage from './Pages/questiondescrptionPage';
import { AuthContextProvider } from './utills/auth';
import { QuestionContextProvider } from './utills/question';
import RequireAuth from './utills/requireAuth';
import { Route, Routes } from 'react-router-dom';
function App() {
  return (
    <>
      <AuthContextProvider>
        <QuestionContextProvider>
          <NavBar />
          <main className="flex bg-[A888B5] min-h-screen">
            <Routes>
              <Route path="/update/:type/:id" element={<Update />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/" element={<Home />} />
              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <ProfilePage />
                  </RequireAuth>
                }
              />
              <Route
                path="/questions"
                element={
                  <RequireAuth>
                    <QuestionsPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/responses"
                element={
                  <RequireAuth>
                    <ResponsePage />
                  </RequireAuth>
                }
              />
              <Route
                path="/question/:id"
                element={<QuestionDescriptionPage />}
              />
              <Route
                path="ask"
                element={
                  <RequireAuth>
                    <AskQuestionPage />
                  </RequireAuth>
                }
              />
            </Routes>
          </main>
        </QuestionContextProvider>
      </AuthContextProvider>
    </>
  );
}

export default App;
