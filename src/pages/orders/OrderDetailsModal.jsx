import PropTypes from "prop-types";
import { IoIosCloseCircle } from "react-icons/io";

const OrderDetailsModal = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center relative mb-3">
          <h2 className="text-2xl font-bold">Order Details #{order.orderId}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 absolute -top-4 -right-4"
          >
            <IoIosCloseCircle size={30} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold">Customer Information</h3>
            <p>
              Name: {order.user.firstName} {order.user.lastName}
            </p>
            <p>Email: {order.user.email}</p>
            <p>Phone: {order.user.mobileNumber}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Delivery Address</h3>
            <p>{order.address.street}</p>
            <p>
              {order.address.district}, {order.address.city}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Payment Information</h3>
            <p>Method: {order.payment.paymentMethod}</p>
            <p>Status: {order.paymentStatus}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Order Items</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4">{item.product.productName}</td>
                      <td className="px-6 py-4 text-center">{item.quantity}</td>
                      <td className="px-6 py-4 text-right">
                        {item.product.realPrice}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-right">
            <p className="text-lg font-semibold">
              Total Amount: {order.totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

OrderDetailsModal.propTypes = {
  order: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default OrderDetailsModal;
