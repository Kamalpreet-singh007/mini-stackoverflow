import { Link, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/auth';
import { QuestionContext } from '../contexts/question';
import { Search, Menu, X, LogOut, Bell, MessageSquare, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

function NavBar() {
  const location = useLocation();
  const context = useContext(QuestionContext);
  if (!context) throw new Error('QuestionContext is null');
  const { getSearchedQuestion } = context;

  const { logout, user, isAuth } = useContext(AuthContext)!;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ||
        localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Hide navbar on landing page
  if (location.pathname === '/') return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    await getSearchedQuestion(searchQuery);
    setSearchQuery('');
  };

  return (
    <nav className="sticky top-0 z-50 w-full">
      <div className="flex h-14 items-center gap-4 border-b border-border bg-card/80 backdrop-blur-xl px-[10%] shadow-sm">
        {/* Brand */}
        <Link to="/home" className="flex items-center gap-2 shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <span className="text-xs font-bold text-primary-foreground">SO</span>
          </div>
          <span className="hidden sm:inline text-sm font-bold text-foreground">Stack</span>
        </Link>

        {/* Search — Desktop (fills remaining space) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 items-center rounded-lg bg-secondary/60 px-3 py-1.5"
        >
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ml-2 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </form>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {isAuth && (
            <>
              <Link to="/messages" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Messages">
                <MessageSquare className="h-4 w-4" />
              </Link>
              <Link to="/notifications" className="text-muted-foreground hover:text-foreground transition-colors relative" aria-label="Notifications">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-primary" />
              </Link>
            </>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {isAuth ? (
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div
                className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground"
                aria-label="User avatar"
              >
                {user!.username[0].toUpperCase()}
              </div>

              {/* Logout */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sign Out</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to sign out of your account?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={logout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Sign Out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm" className="rounded-md h-8 px-4 text-xs">Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden ml-auto">
          <button onClick={() => setDarkMode(!darkMode)} className="text-muted-foreground" aria-label="Toggle dark mode">
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button className="text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card/90 backdrop-blur-xl px-4 py-4 space-y-3 shadow-sm animate-fade-in">
          <form onSubmit={handleSearch} className="flex items-center rounded-lg bg-secondary/60 px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search questions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="ml-2 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
          </form>
          <Link to="/home" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-foreground py-2">Home</Link>
          {isAuth && (
            <>
              <Link to="/messages" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-foreground py-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Messages
              </Link>
              <Link to="/notifications" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-medium text-foreground py-2 flex items-center gap-2">
                <Bell className="h-4 w-4" /> Notifications
              </Link>
            </>
          )}
          {isAuth ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="block text-sm text-destructive py-2 w-full text-left">Logout</button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sign Out</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to sign out of your account?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Sign Out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" className="w-full rounded-md">Sign In</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default NavBar;
