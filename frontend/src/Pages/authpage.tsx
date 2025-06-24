import {useState} from "react"
import {Loginform, Signinform} from "../Components/forms"
import "../Css/authpage.css"

const AuthPage =() => {
    const[islogin, setIslogin] = useState(true);

    const toggleForm = () =>{
    setIslogin(!islogin)
}

    return(
        <>
        <div className="form-container">
            <h2>{islogin ? "Login" :"Sgin in"}</h2>
            {islogin ?(
            <Loginform/>
            ):(
            <Signinform />
            )}

            <p>
            {islogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={toggleForm} className="toggle-button">
            {islogin ? "Register" : "Login"}
            </button>
      </p>
        </div>
        </>
    )

}
export default AuthPage