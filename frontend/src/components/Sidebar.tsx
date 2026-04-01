import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/auth';
import { HelpCircle, MessageSquare, User, LogOut, Home, LogIn } from 'lucide-react';
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

function Sidebar() {
  const location = useLocation();
  const { logout, isAuth } = useContext(AuthContext)!;

  // Hide sidebar on landing and login pages
  const hiddenPaths = ['/', '/login'];
  if (hiddenPaths.includes(location.pathname)) return null;

  const authLinks = [
    { to: '/home', label: 'Home', icon: Home },
    { to: '/questions', label: 'My Questions', icon: HelpCircle },
    { to: '/responses', label: 'My Responses', icon: MessageSquare },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const publicLinks = [
    { to: '/home', label: 'Home', icon: Home },
  ];

  const navLinks = isAuth ? authLinks : publicLinks;

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 rounded-xl bg-card border border-border sticky top-[5.5rem] h-[calc(100vh-7rem)] overflow-hidden shadow-sm">
      <nav className="flex flex-col flex-1 py-2">
        {/* Navigation Links */}
        <div className="flex flex-col px-3 gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to || (link.to === '/' && location.pathname === '/home');
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Actions */}
        <div className="p-3 mt-4">
          {isAuth ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
                  <LogOut className="h-4 w-4" />
                  Logout
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
                  <AlertDialogAction
                    onClick={logout}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Sign Out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Link to="/login" className="block w-full">
              <Button className="w-full gap-2" variant="default">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
