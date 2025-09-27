import { Link } from 'react-router-dom';
// import '../Css/Navbar.css';
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
      <nav className="navBar flex  w-full items-center p-4 bg-[#1a1a22] border-b-2 border-white text-orange-400">
        <div className="navBar-brand flex items-center text-3xl font-bold">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span className="pl-3">Stack Overflow </span>
        </div>
        <form
          onSubmit={handelsearch}
          className="navBar-search flex items-center rounded-xl border-2 ml-[4rem] border-black py-1 text-violet-600 bg-amber-100"
        >
          <input
            type="text"
            className="navBar-search-input px-4 align-items-center bg-transparent outline-none text-black"
            placeholder="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="search"
          />
          <button type="submit" className="pr-3">
            🔍
          </button>
        </form>

        <div className="navBar-links flex items-center text-amber-100 font-bold space-x-4 ml-auto">
          <Link
            to="/"
            className="navBar-link border-2 border-transparent bg-[#f48024] rounded-xl px-10 py-2 hover:border-[#414153]"
          >
            Home
          </Link>

          <div className="navBar-user">
            {isAuth ? (
              <>
                <span
                  className="profile-Icon rounded-full bg-[#f48024] text-white p-4 cursor-pointer"
                  onClick={toggleDropDown}
                >
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
              <Link
                to="/login"
                className="navBar-login-link border-2 border-transparent bg-[#f48024] rounded-xl px-10 py-2 hover:border-[#414153]"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
export default NavBar;
