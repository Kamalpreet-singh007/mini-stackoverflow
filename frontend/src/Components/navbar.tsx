import { Link } from "react-router-dom";
import '../Css/Navbar.css'
import {useContext, useState} from "react"
import{authContext} from"../utills/auth"
function NavBar(){
  const {isAuth} =useContext(authContext)!;
  const{logout} = useContext(authContext)!;
  const{user} = useContext(authContext)!;
  const [profileDropDown, setProfileDropDown] = useState(false)
  const handelsearch = async(e : React.FormEvent)=>{
    console.log("search");
    
  }
  const toggleDropDown = async() =>{
    setProfileDropDown(!profileDropDown)
  }
  
    return(
    <>
        <nav className="navBar">
            <div className="navBar-brand">
              <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
              <span>Stack Overflow  </span>

            </div>
            <form onSubmit= {handelsearch}  className="navBar-search">
            <button type = "submit">🔍</button>
              
              <input 
            type="text"
            className="navBar-search-input" 
            placeholder="search"
            id ="search"
            />
            </form>

            <div className="navBar-links">
            <Link to = "/" className="navBar-link">Home</Link>
            </div>

          <div className = "navBar-user">
          {isAuth?(
            <>
            <span className ="profile-Icon" onClick={toggleDropDown}>{user!.username[0]}</span>
            {profileDropDown && (
                <div className="dropdown-menu">
                    <Link to="/profile">Profile</Link>
                    <Link to="/questions">Questions</Link>
                    <Link to="/responses">Responses</Link>
                    <Link to="/" onClick = {logout}>Logout</Link>
                </div>
)}
            </>
          ):
          <Link to = "/login" className = "navBar-login-link">Login</Link>
          
          }

              
            </div>
        </nav>

    </>
    )
  }

export default NavBar