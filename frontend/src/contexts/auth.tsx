import { createContext, useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { apiFetch } from '../lib/api';

interface AuthContextType {
  isAuth: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<boolean>;
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
      refreshAcessToken();
      startRefreshInterval();
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const data = await apiFetch('/token/', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));
      setAccessToken(data.access);
      setUser(data.user);
      setIsAuth(true);
      startRefreshInterval();
      return true;
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your email and password.');
      return false;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      await apiFetch('/user/register/', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
      });
      alert('Registration successful!');
    } catch (err) {
      console.error(err);
      alert('Sign up failed');
    }
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      const access = localStorage.getItem('access_token');
      if (access && refresh) {
        await apiFetch('/user/logout/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${access}`,
          },
          body: JSON.stringify({ refresh }),
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      stopRefreshInterval();
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      setAccessToken(null);
      setUser(null);
      setIsAuth(false);
    }
  };

  const refreshAcessToken = async () => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    if (accessToken) {
      try {
        const data = await apiFetch('/token/refresh/', {
          method: 'POST',
          body: JSON.stringify({ refresh: refreshToken }),
        });
        localStorage.setItem('access_token', data.access);
        setAccessToken(data.access);
      } catch (error) {
        console.error('Token refresh error:', error);
        logout();
      }
    }
  };

  const startRefreshInterval = () => {
    if (refreshIntervalRef.current !== null) return;
    refreshIntervalRef.current = setInterval(() => {
      refreshAcessToken();
    }, 1 * 60 * 1000);
  };

  const stopRefreshInterval = () => {
    if (refreshIntervalRef.current !== null) {
      clearInterval(refreshIntervalRef.current);
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
