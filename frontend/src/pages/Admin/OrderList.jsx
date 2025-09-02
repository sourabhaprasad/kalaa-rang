import React from "react";
import { useGetOrdersQuery, useDeliverOrderMutation } from "../../redux/api/orderApiSlice";
import { FaTruck, FaCheckCircle, FaClock, FaEye, FaCalendar, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const OrderList = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [deliverOrder] = useDeliverOrderMutation();

  const handleDeliverOrder = async (orderId) => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
      toast.success("Order marked as delivered successfully");
    } catch (error) {
      console.error("Error marking order as delivered:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 pt-20">
        <div className="">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading orders...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 text-lg">{error?.data?.message || error.error}</p>
            </div>
          ) : orders?.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-bold text-gray-300 mb-4">No orders found</h3>
              <p className="text-gray-500">No orders have been placed yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {orders?.map((order) => (
                <div key={order._id} className="bg-black border border-gray-700 rounded-lg p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                    
                    {/* Order Image & Info */}
                    <div className="lg:col-span-2 flex items-center gap-4">
                      {order.orderItems[0] && (
                        <img
                          src={order.orderItems[0].image}
                          alt={order.orderItems[0].name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <h3 className="text-white font-bold">#{order._id.slice(-8)}</h3>
                        <p className="text-gray-400 text-sm flex items-center gap-1">
                          <FaCalendar />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-gray-400 text-sm flex items-center gap-1">
                          <FaUser />
                          {order.user ? order.user.username : "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="text-center">
                      <p className="text-white font-bold text-lg">₹{order.totalPrice}</p>
                      <p className="text-gray-400 text-sm">{order.orderItems.length} item(s)</p>
                    </div>

                    {/* Payment Status */}
                    <div className="flex justify-center">
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
                    </div>

                    {/* Delivery Status */}
                    <div className="flex justify-center">
                      <div className="flex items-center gap-2">
                        {order.isDelivered ? (
                          <FaCheckCircle className="text-green-400" />
                        ) : (
                          <FaTruck className="text-yellow-400" />
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

                    {/* Actions */}
                    <div className="flex gap-2 justify-end">
                      <Link
                        to={`/orders/${order._id}`}
                        state={{ fromAdmin: true }}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                      >
                        View
                      </Link>
                      
                      {order.isPaid && !order.isDelivered && (
                        <button
                          onClick={() => handleDeliverOrder(order._id)}
                          className="inline-flex items-center gap-2 bg-white text-black font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <FaTruck />
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;