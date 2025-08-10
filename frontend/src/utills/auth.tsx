// export const isAuthenticated = (): boolean => {
//   return !!localStorage.getItem('token');
// };

// export default isAuthenticated

import { createContext, useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  isAuth: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => void | Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem('access_token')
  );
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    if (accessToken) {
      setAccessToken(accessToken);
    }
    if (user) {
      setUser(JSON.parse(user));
      setIsAuth(true);
      setLoading(false);
    }
  }, []);

  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      const data = await response.json();

      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));
      setAccessToken(data.access);
      setUser(data.user);
      alert('logged in');
      startRefreshInterval();
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your email and password.');
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/user/register/', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });
      if (!response.ok) {
        throw new Error('Sign in failed');
      }
      alert('Registartion Succesfully');
    } catch (err) {
      console.error(err);
      alert('Sign up failed');
    }
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      const access = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/user/logout/', {
        method: 'post',
        headers: {
          Authorization: `Bearer ${access}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: refresh,
        }),
      });
      if (!response.ok) {
        throw new Error('Logout Failed');
      }

      stopRefreshInterval();
      alert('Logged out successfully');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      setAccessToken(null);
    } catch (err) {
      console.error(err);
      alert('LogOut failed');
    }
  };
  const refreshAcessToken = async () => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    if (accessToken) {
      try {
        const response = await fetch(
          'http://localhost:8000/api/token/refresh/',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              refresh: refreshToken,
            }),
          }
        );
        if (!response.ok) {
          throw new Error('Failed to refresh token');
        }
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        setAccessToken(data.access);
      } catch (error) {
        console.error('Token refresh error:', error);
        alert('Session expired. Please log in again.');
        logout();
      }
    }
  };
  const startRefreshInterval = () => {
    if (refreshIntervalRef.current !== null) return;

    refreshIntervalRef.current = setInterval(() => {
      refreshAcessToken();
    }, 4 * 60 * 1000); // Refresh every 15 minutes
    return refreshIntervalRef;
  };
  const stopRefreshInterval = () => {
    if (refreshIntervalRef.current !== null) {
      clearInterval(refreshIntervalRef.current); // 💡 This is how you know which one to stop!
      refreshIntervalRef.current = null;
    }
  };
  return (
    <AuthContext.Provider
      value={{ isAuth, accessToken, login, signup, logout, user, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
