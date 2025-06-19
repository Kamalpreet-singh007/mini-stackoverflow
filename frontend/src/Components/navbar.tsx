import { Link } from "react-router-dom";
import '../Css/Navbar.css'
function NavBar(){

  const handelsearch = async(e : React.FormEvent)=>{
    console.log();
    
  }

    return(
    <>
        <nav className="navBar">
            <div className="navBar-brand">
              <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
              <span>Stack Overflow  </span>

            </div>
            <form onSubmit= {handelsearch} className="navBar-search">
            <button type = "submit">🔍</button>
              
              <input 
            type="text"
            className="navBar-search-input" 
            placeholder="search"
            />
            </form>

            <div className="navBar-links">
            <Link to = "/login" className="navBar-link">Home</Link>
            <Link to = "/Search" className="navBar-link">search</Link>
            </div>
            <div className = "navBar-user">
              
            </div>
        </nav>

    </>
    )
}

export default NavBar