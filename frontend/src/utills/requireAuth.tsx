import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './auth';

interface Props {
  children: React.ReactNode;
}

const RequireAuth: React.FC<Props> = ({ children }) => {
  const auth = useContext(AuthContext);

  if (!auth || auth.loading) return <p>Loading...</p>;
  if (!auth.user) return <Navigate to="/login" />;

  return <>{children}</>;
};

export default RequireAuth;
