import { useState, useEffect } from 'react';
import { FaUsers, FaShoppingCart, FaDollarSign, FaBox } from 'react-icons/fa';
import StatCard from '../../components/DashboardStats';
import { getStatistics } from '../../api/api';
import hotItem from '../../assets/hotitem.jpg';
import { ImSpinner } from "react-icons/im";


const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    recentOrders: [],
    topProducts: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        const response = await getStatistics();
        
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading)
    return (
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <ImSpinner className="animate-spin h-12 w-12 text-blue-600" />
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<FaUsers className="text-blue-500" />}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<FaShoppingCart className="text-green-500" />}
        />
        <StatCard
          title="Total Revenue"
          value={`${stats.totalRevenue.toFixed(2)} VND`}
          icon={<FaDollarSign className="text-yellow-500" />}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<FaBox className="text-purple-500" />}
        />
      </div>

      {/* Recent Orders & Top Products */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentOrders?.map(order => (
                  <tr key={order.orderId} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap">#{order.orderId}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{order.user.email}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{order.totalAmount.toFixed(2)} VND</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' : 
                          order.orderStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Top Products</h3>
          <div className="space-y-4">
            {stats.topProducts?.map(product => (
              <div key={product.productId} className="flex items-center p-4 hover:bg-gray-50 rounded-lg">
                <img 
                  src={product.imageUrl || hotItem} 
                  alt={product.productName}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{product.productName}</h4>
                  <p className="text-sm text-gray-500">{product.price.toFixed(2)} VND</p>
                </div>
                <div className="text-sm font-medium text-green-600">
                  {product.soldQuantity} Sold
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;