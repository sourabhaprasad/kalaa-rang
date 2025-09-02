import React, { useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetOrderDetailsQuery } from "../../redux/api/orderApiSlice";
import { FaArrowLeft, FaCreditCard, FaTruck, FaCheckCircle, FaClock } from "react-icons/fa";
import PaymentModal from "../../components/PaymentModal";

const OrderDetails = () => {
  const { id: orderId } = useParams();
  const location = useLocation();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const { userInfo } = useSelector((state) => state.auth);
  
  const isAdminUser = userInfo?.email === 'kalaarang@gmail.com' || userInfo?.username === 'kalaarang';
  const isAdminView = location.pathname.includes('/admin') || 
                     document.referrer.includes('/admin') ||
                     location.state?.fromAdmin ||
                     isAdminUser;
  
  
  const {
    data: order,
    isLoading,
    error,
    refetch
  } = useGetOrderDetailsQuery(orderId);

  const handlePaymentSuccess = () => {
    refetch(); // Refresh order details to show updated payment status
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Order Not Found</h2>
          <p className="text-gray-400 mb-6">The order you're looking for doesn't exist.</p>
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaArrowLeft />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return <FaCheckCircle className="text-green-400" />;
      case "delivered":
        return <FaTruck className="text-blue-400" />;
      default:
        return <FaClock className="text-yellow-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "delivered":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      default:
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-12 pt-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/orders"
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Order Details</h1>
            <p className="text-gray-400">Order #{order._id.slice(-8)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-black border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Order Status</h2>
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getStatusColor(order.isPaid ? (order.isDelivered ? "delivered" : "paid") : "pending")}`}>
                  {getStatusIcon(order.isPaid ? (order.isDelivered ? "delivered" : "paid") : "pending")}
                  <span className="font-semibold">
                    {order.isDelivered ? "Delivered" : order.isPaid ? "Paid" : "Pending Payment"}
                  </span>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Order Date:</span>
                  <span className="text-white">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                {order.isPaid && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Paid Date:</span>
                    <span className="text-white">{new Date(order.paidAt).toLocaleDateString()}</span>
                  </div>
                )}
                {order.isDelivered && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Delivered Date:</span>
                    <span className="text-white">{new Date(order.deliveredAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-black border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{item.name}</h3>
                      <p className="text-gray-400">Quantity: {item.qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">₹{item.price}</p>
                      <p className="text-sm text-gray-400">₹{(item.price * item.qty).toFixed(2)} total</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-black border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Shipping Address</h2>
              <div className="text-gray-300">
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Order Summary & Payment */}
          <div className="space-y-6">
            {/* Payment Status & Action - Only show for user view */}
            {!isAdminUser && !order.isPaid && (
              <div className="bg-black border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FaCreditCard />
                  Payment Required
                </h2>
                <p className="text-gray-400 mb-6">Complete your payment to process this order.</p>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPaymentModal(true);
                  }}
                  className="w-full bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors relative"
                  style={{ zIndex: 9999, position: 'relative' }}
                >
                  Pay Now - ₹{order.totalPrice}
                </button>
              </div>
            )}

            {/* Admin View - Payment Status Display Only */}
            {isAdminUser && (
              <div className="bg-black border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FaCreditCard />
                  Payment Status
                </h2>
                <div className="flex items-center gap-2">
                  {order.isPaid ? (
                    <FaCheckCircle className="text-green-400" />
                  ) : (
                    <FaClock className="text-yellow-400" />
                  )}
                  <span className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                    order.isPaid 
                      ? "bg-green-400/10 text-green-400 border border-green-400/20" 
                      : "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                  }`}>
                    {order.isPaid ? "Payment Completed" : "Payment Pending"}
                  </span>
                </div>
                {!order.isPaid && (
                  <p className="text-gray-400 mt-2 text-sm">Customer needs to complete payment</p>
                )}
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-black border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Items:</span>
                  <span className="text-white">₹{order.itemsPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping:</span>
                  <span className="text-white">₹{order.shippingPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax:</span>
                  <span className="text-white">₹{order.taxPrice}</span>
                </div>
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="text-xl font-bold text-white">Total:</span>
                    <span className="text-xl font-bold text-white">₹{order.totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            {order.isPaid && order.paymentMethod && (
              <div className="bg-black border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Payment Method</h2>
                <div className="text-gray-300">
                  <p className="capitalize">{order.paymentMethod.method || "Credit Card"}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Payment ID: {order.paymentMethod.id || "N/A"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal - Only show for user view */}
        {!isAdminUser && showPaymentModal && order && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          order={order}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default OrderDetails;
