import { Link, useLocation } from "react-router-dom";
import { removeToken } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/logoshop.png";
import adminIcon from "../assets/adminicon.jpg";

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <div className="h-screen overflow-hidden bg-gray-100">
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                to="/dashboard"
                className="flex-shrink-0 flex items-center mr-3"
              >
                <img
                  className="h-8 w-auto"
                  src={logo}
                  alt="logo"
                  onError={(e) => {
                    console.error("Image failed to load:", e);
                    e.target.src = "fallback-image-path"; // Optional fallback
                  }}
                />
              </Link>

              <Link
                to="/dashboard"
                className={`inline-flex items-center px-3 py-2 border-b-2 ${
                  location.pathname === "/dashboard"
                    ? "border-indigo-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/dashboard/users"
                className={`inline-flex items-center px-3 py-2 border-b-2 ${
                  location.pathname === "/dashboard/users"
                    ? "border-indigo-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Users
              </Link>
              <Link
                to="/dashboard/categories"
                className={`inline-flex items-center px-3 py-2 border-b-2 ${
                  location.pathname === "/dashboard/categories"
                    ? "border-indigo-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Categories
              </Link>
              <Link
                to="/dashboard/products"
                className={`inline-flex items-center px-3 py-2 border-b-2 ${
                  location.pathname === "/dashboard/products"
                    ? "border-indigo-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Products
              </Link>
              <Link
                to="/dashboard/orders"
                className={`inline-flex items-center px-3 py-2 border-b-2 ${
                  location.pathname === "/dashboard/orders"
                    ? "border-indigo-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Orders
              </Link>
            </div>
            <div className="flex items-center">
              <button className="inline-flex items-center px-3 py-2">
                <img
                  className="h-8 w-8 rounded-full"
                  src={adminIcon}
                  alt="avatar"
                />
              </button>
              <span className="text-gray-500">Admin</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center pr-3 py-2 ml-4 text-gray-500 hover:text-gray-700"
              >
                <FaSignOutAlt className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="overflow-auto h-[calc(100vh-64px)] no-scrollbar max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-16">
        {children}
      </main>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
