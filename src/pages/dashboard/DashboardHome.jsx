import { useState, useEffect } from 'react';
import { FaUsers, FaShoppingCart, FaDollarSign, FaBox } from 'react-icons/fa';
import StatCard from '../../components/DashboardStats';
import { axiosInstance } from '../../config/axiosConfig';


const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalUsers: 13,
    totalOrders: 4,
    totalRevenue: 14000000,
    totalProducts: 10,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // const token = getToken();
        // const response = await axiosInstance.get('/admin/dashboard/stats', {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        // setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<FaUsers />}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<FaShoppingCart />}
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={<FaDollarSign />}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<FaBox />}
        />
      </div>

      {/* Add more dashboard widgets here */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          {/* Add recent orders table/list here */}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Top Products</h3>
          {/* Add top products chart/list here */}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome; 