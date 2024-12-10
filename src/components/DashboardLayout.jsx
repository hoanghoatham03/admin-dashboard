import { Link, useLocation } from 'react-router-dom';
import { removeToken } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaSignOutAlt } from 'react-icons/fa';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                to="/dashboard"
                className={`inline-flex items-center px-3 py-2 border-b-2 ${
                  location.pathname === '/dashboard'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/dashboard/users"
                className={`inline-flex items-center px-3 py-2 border-b-2 ${
                  location.pathname === '/dashboard/users'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Users
              </Link>
              <Link
                to="/dashboard/categories"
                className={`inline-flex items-center px-3 py-2 border-b-2 ${
                  location.pathname === '/dashboard/categories'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Categories
              </Link>
              <Link
                to="/dashboard/products"
                className={`inline-flex items-center px-3 py-2 border-b-2 ${
                  location.pathname === '/dashboard/products'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Products
              </Link>
              <Link
                to="/dashboard/orders"
                className={`inline-flex items-center px-3 py-2 border-b-2 ${
                  location.pathname === '/dashboard/orders'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Orders
              </Link>
            </div>
            <div className="flex">
              <button
                onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 text-red-600 hover:text-red-800"
            >
              Logout
              <FaSignOutAlt className="ml-2" />
              </button>
              
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout; 