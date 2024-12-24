import { useState, useEffect } from "react";
import { getAllOrders } from "../../api/api";
import OrderStatusModal from "./OrderStatusModal";
import OrderDetailsModal from "./OrderDetailsModal";
import { ImSpinner } from "react-icons/im";
import { MdModeEditOutline } from "react-icons/md";
import { FaEye } from "react-icons/fa";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize] = useState(7);
  const [totalPages, setTotalPages] = useState(1);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrders(pageNo, pageSize);
      // Ensure we're setting an array, even if empty
      console.log(">>> response", response);

      setOrders(Array.isArray(response.data.orders) ? response.data.orders : []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pageNo, pageSize]);

  const handleStatusUpdate = (order) => {
    setSelectedOrder(order);
    setShowStatusModal(true);
  };

  const handleViewDetails = (order) => {
    setSelectedOrderDetails(order);
    setShowDetailsModal(true);
  };

  const handlePreviousPage = () => {
    setPageNo((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setPageNo((prev) => (prev + 1 < totalPages ? prev + 1 : prev));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "SUCCESS":
        return "bg-green-100 text-green-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
      <h2 className="text-2xl font-bold mb-4">Orders</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  text-center">
                Date
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  text-center">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  text-center">
                Total Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider  text-center">
                Order Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                Payment Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr
                key={order.orderId}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap  text-center">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap  text-center">
                  {order.user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap  text-center">
                  {order.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap  text-center">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap  text-center">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => handleStatusUpdate(order)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <div className="flex items-center">
                      <span className="mr-1">Update</span>
                      <MdModeEditOutline />
                    </div>
                  </button>

                  <button
                    onClick={() => handleViewDetails(order)}
                    className="text-indigo-600 hover:text-indigo-900 ml-2"
                  >
                    <div className="flex items-center">
                      <span className="mr-1">View Details</span>
                      <FaEye />
                    </div>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination Controls */}
        <div className="px-6 py-4 flex items-center justify-between border-t">
          <div className="flex-1 flex justify-between items-center">
            <button
              onClick={handlePreviousPage}
              disabled={pageNo === 0}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                pageNo === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPageNo(index)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    pageNo === index
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={pageNo + 1 >= totalPages}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                pageNo + 1 >= totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {showStatusModal && (
        <OrderStatusModal
          order={selectedOrder}
          onClose={() => setShowStatusModal(false)}
          onSuccess={() => {
            setShowStatusModal(false);
            fetchOrders();
          }}
        />
      )}
      {showDetailsModal && (
        <OrderDetailsModal
          order={selectedOrderDetails}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
};

export default OrderList;
