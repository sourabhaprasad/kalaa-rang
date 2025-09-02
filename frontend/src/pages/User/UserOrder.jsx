import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import { FaEye, FaCheckCircle, FaClock } from "react-icons/fa";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-12 pt-20">
        <h1 className="text-3xl font-bold text-white mb-8">My Orders</h1>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 text-lg">{error?.data?.error || error.error}</p>
          </div>
        ) : orders?.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-gray-300 mb-4">No orders found</h3>
            <p className="text-gray-500 mb-8">You haven't placed any orders yet.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders?.map((order) => (
              <div key={order._id} className="bg-black border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Order #{order._id.slice(-8)}</h3>
                    <p className="text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {order.isPaid ? (
                        <FaCheckCircle className="text-green-400" />
                      ) : (
                        <FaClock className="text-yellow-400" />
                      )}
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.isPaid 
                          ? "bg-green-400/10 text-green-400 border border-green-400/20" 
                          : "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                      }`}>
                        {order.isPaid ? "Paid" : "Pending"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {order.isDelivered ? (
                        <FaCheckCircle className="text-green-400" />
                      ) : (
                        <FaClock className="text-yellow-400" />
                      )}
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.isDelivered 
                          ? "bg-green-400/10 text-green-400 border border-green-400/20" 
                          : "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                      }`}>
                        {order.isDelivered ? "Delivered" : "Processing"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {order.orderItems[0] && (
                      <img
                        src={order.orderItems[0].image}
                        alt={order.orderItems[0].name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <p className="text-white font-semibold">
                        {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}
                      </p>
                      <p className="text-gray-400">Total: ₹{order.totalPrice}</p>
                    </div>
                  </div>
                  
                  <Link
                    to={`/orders/${order._id}`}
                    className="inline-flex items-center gap-2 bg-white text-black font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FaEye />
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrder;
