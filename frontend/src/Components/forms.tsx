import {useState, useContext} from "react";
import {authContext} from "../utills/auth.tsx"
import { useNavigate } from "react-router-dom";


export const Loginform:React.FC=()=>{
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const { login} = useContext(authContext)!;
    const navigate = useNavigate();


    const handel_login = async (e:React.FormEvent)=> {
    e.preventDefault();
    console.log("hello")
    login(email, password)
    navigate("/"); 

};
return (
    <form onSubmit ={handel_login} className = "form">
        <input 
        type="text" 
        className="form-input" 
        placeholder = "Email"
        value = {email}
        required
        id = "email"
        onChange = {(e) => setemail(e.target.value)}
         />
        <input 
        type="password" 
        className="form-input" 
        placeholder ="Password"
        required
        id  ="password"
        value = {password} 
        onChange ={(e) =>setpassword(e.target.value)}/>

        <button className="form-submit" type = "submit">Login</button>
    </form>
)
}

export const Signinform =()=>{
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [username, setusername] = useState("");
    const { signup} = useContext(authContext)!;
    const navigate = useNavigate();


    
    const handel_signin = async (e:React.FormEvent)=> {
    e.preventDefault();
    signup(username, email ,password)
    navigate("/login"); 
    
    
} 
    

    return(
    <form onSubmit={handel_signin} className = "form" >
        <input
        type="text"
        placeholder="Username"
        required
        id = "username"
        value={username}
        className ="form-input"
        onChange={(e) => setusername(e.target.value)}
      />
        <input 
        type="email" 
        className="form-input" 
        placeholder = "Email"
        value = {email}
        id ="email"
        required
        onChange = {(e) => setemail(e.target.value)}
         />
        <input 
        type="password" 
        className="form-input" 
        placeholder ="Password"
        required
        value = {password} 
        id ="password"
        onChange ={(e) =>setpassword(e.target.value)}/>
        <button className="form-submit" type = "submit">Signin</button>
    </form>)
}

export default Signinform; Loginform