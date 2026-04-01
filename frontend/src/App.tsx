import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthContextProvider } from "./contexts/auth";
import { QuestionContextProvider } from "./contexts/question";
import RequireAuth from "./components/RequireAuth";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import AskQuestionPage from "./pages/AskQuestionPage";
import QuestionDescriptionPage from "./pages/QuestionDescriptionPage";
import QuestionsPage from "./pages/QuestionsPage";
import ResponsePage from "./pages/ResponsePage";
import ProfilePage from "./pages/ProfilePage";
import UpdatePage from "./pages/UpdatePage";
import NotFound from "./pages/NotFound";
import RightSidebar from "./components/RightSidebar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthContextProvider>
          <QuestionContextProvider>
            <div className="flex flex-col min-h-screen bg-background">
              <NavBar />
              <div className="flex flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-6">
                <Sidebar />
                <main className="flex-1 min-w-0 py-6">
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<AuthPage />} />
                    <Route path="/question/:id" element={<QuestionDescriptionPage />} />
                    <Route path="/update/:type/:id" element={<UpdatePage />} />
                    <Route
                      path="/ask"
                      element={
                        <RequireAuth>
                          <AskQuestionPage />
                        </RequireAuth>
                      }
                    />
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
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <RightSidebar />
              </div>
            </div>
          </QuestionContextProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

