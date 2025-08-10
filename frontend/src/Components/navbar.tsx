import { Link } from 'react-router-dom';
import '../Css/Navbar.css';
import { useContext, useState } from 'react';
import { AuthContext } from '../utills/auth';
import { QuestionContext } from '../utills/question';

function NavBar() {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error(
      'useContext(QuestionContext) returned null — did you forget to wrap a provider?'
    );
  }
  const { getSearchedQuestion } = context;
  const { logout, user, isAuth } = useContext(AuthContext)!;
  const [profileDropDown, setProfileDropDown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handelsearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await getSearchedQuestion(searchQuery);
    if (data) {
      setSearchQuery('');
    }
  };
  const toggleDropDown = async () => {
    setProfileDropDown(!profileDropDown);
  };

  return (
    <>
      <nav className="navBar">
        <div className="navBar-brand">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span>Stack Overflow </span>
        </div>
        <form onSubmit={handelsearch} className="navBar-search">
          <button type="submit">🔍</button>

          <input
            type="text"
            className="navBar-search-input"
            placeholder="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="search"
          />
        </form>

        <div className="navBar-links">
          <Link to="/" className="navBar-link">
            Home
          </Link>
        </div>

        <div className="navBar-user">
          {isAuth ? (
            <>
              <span className="profile-Icon" onClick={toggleDropDown}>
                {user!.username[0]}
              </span>
              {profileDropDown && (
                <div className="dropdown-menu">
                  <Link to="/profile">Profile</Link>
                  <Link to="/questions">Questions</Link>
                  <Link to="/responses">Responses</Link>
                  <Link to="/" onClick={logout}>
                    Logout
                  </Link>
                </div>
              )}
            </>
          ) : (
            <Link to="/login" className="navBar-login-link">
              Login
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

export default NavBar;
