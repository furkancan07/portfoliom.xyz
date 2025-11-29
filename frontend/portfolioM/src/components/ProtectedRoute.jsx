import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Artık username kontrolü yapıyoruz, token cookie'de
  const username = localStorage.getItem('username');

  if (!username) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 