// export const isAuthenticated = (): boolean => {
//   return !!localStorage.getItem('token');
// };

// export default isAuthenticated

import {createContext,useState} from "react";
import type { ReactNode } from "react";
import type { User} from "../types"


 

interface AuthContextType {
  isAuth: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean } | undefined>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  user: User |null;

}


export const authContext = createContext<AuthContextType | null>(null); 

export const AuthContextProvider: React.FC<{ children: ReactNode }> =({children}) =>{
    const [token,setToken] =useState(()=> localStorage.getItem("token"));
    const isAuth:boolean  = !!token
    const[user, setUser] = useState<User| null>(null)
    const login = async(email:string, password:string) => {
        
    try{
        const response = await fetch("http://localhost:8000/api/token/",
            {
                method :"post",
                headers: {
                    "Content-Type": "application/json",
                },
                body :JSON.stringify( {
                    email:email,
                    password:password,
                }),
            });
            if(!response.ok){
                throw new Error("Invalid credentials");
                    
            }
            const data = await response.json();
            
            localStorage.setItem("access_token",data.access);
            localStorage.setItem("refrsh_token", data.refresh);
            setToken(data.refresh)
            setUser(data.user)
            alert("logged in")
            return { success: true };
    }
    catch(error){
        console.error("Login error:",error);
        alert("Login failed. Please check your email and password.");
  
        
    }
    
    }

    const signup = async(username:string, email:string, password:string) =>{

        try{
        const response = await fetch("http://localhost:8000/api/user/register/",{
            method :"post",
                headers: {
                    "Content-Type": "application/json",
                },
            body:JSON.stringify({
                username:username,
                email:email,
                password:password,
            }),
        });
        if(!response.ok){
                throw new Error("Sign in failed");
                    
            }
        alert("Registartion Succesfully");
        
            
    }
    catch (err) {
      console.error(err);
      alert("Sign up failed");
    }
    }

    const logout = async()=>{

        try{
        const refresh = localStorage.getItem("refresh_token")
        const access = localStorage.getItem("access_token")
        const response =await fetch("http://localhost:8000/api/user/logout/",{
            method:"post",
            headers: {
                    "Authorization": `Bearer ${access}`,    
                    "Content-Type": "application/json",
                },
                body:JSON.stringify({
                    refresh : refresh
            }),
            })
            if(!response.ok){
                throw new Error("Logout Failed");
            }

            localStorage.removeItem("access_token");
            localStorage.removeItem("refrsh_token");
        }
        catch (err) {
        console.error(err);
        alert("LogOut failed");
    }
        

        localStorage.removeItem("token");
    setToken(null);
    }



     return (
    <authContext.Provider value={{ isAuth, token, login, signup, logout,user, }}>
      {children}
    </authContext.Provider>
  );
}
