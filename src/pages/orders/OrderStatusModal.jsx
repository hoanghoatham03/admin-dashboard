import { useState } from 'react';
import PropTypes from 'prop-types';
import { updateOrderStatus, updatePaymentStatus } from '../../api/api';

const OrderStatusModal = ({ order, onClose, onSuccess }) => {
  const [orderStatus, setOrderStatus] = useState(order?.orderStatus || 'PENDING');
  const [paymentStatus, setPaymentStatus] = useState(order?.paymentStatus || 'PENDING');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (orderStatus !== order.orderStatus) {
        console.log(">>>order status request:", orderStatus);
        await updateOrderStatus(order.user.userId, order.orderId, orderStatus);
      }
      if (paymentStatus !== order.paymentStatus) {
        await updatePaymentStatus(order.user.userId, order.orderId, paymentStatus);
      }
      onSuccess();
    } catch (error) {
      setError('Failed to update status');
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Update Order Status</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Order Status</label>
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="PENDING">Pending</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Payment Status</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="PENDING">Pending</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

OrderStatusModal.propTypes = {
  order: PropTypes.shape({
    orderId: PropTypes.number.isRequired,
    orderStatus: PropTypes.string,
    user: PropTypes.shape({
      userId: PropTypes.number.isRequired,
    }),
    paymentStatus: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default OrderStatusModal; 