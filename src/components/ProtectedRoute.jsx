import { Navigate } from 'react-router-dom';
import { getToken } from '../store/authStore';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  const token = getToken();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute; 