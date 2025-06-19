import {useState} from "react";
type Props = {
  onSuccessToggle: () => void;
};

export const Loginform:React.FC=()=>{
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");

    const handel_login = async (e:React.FormEvent)=> {
    e.preventDefault();
    
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
            alert("login succesfully")

    }
    catch(error){
        console.error("Login error:",error);
        alert("Login failed. Please check your email and password.");
  
        
    }
    console.log("login",{email,password});
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

export const Signinform =({ onSuccessToggle }: Props)=>{
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [username, setusername] = useState("");
    
    
    const handel_signin = async (e:React.FormEvent)=> {
    e.preventDefault();
    console.log({ username, email, password });
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
        onSuccessToggle();
            
    }
    catch (err) {
      console.error(err);
      alert("Sign up failed");
    }


    
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