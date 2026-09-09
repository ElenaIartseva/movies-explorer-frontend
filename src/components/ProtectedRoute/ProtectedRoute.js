import { Navigate } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext.js';

const ProtectedRoute = ({ element: Component, ...props }) => {
  const { loggedIn } = useCurrentUser();

  return loggedIn ? <Component {...props} /> : <Navigate to="/signin" replace />;
};

export { ProtectedRoute };
