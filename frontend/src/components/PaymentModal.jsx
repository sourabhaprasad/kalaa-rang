import React, { useState } from "react";
import { FaTimes, FaCreditCard, FaMobile, FaTruck, FaCheckCircle } from "react-icons/fa";
import { usePayOrderMutation } from "../redux/api/orderApiSlice";

const PaymentModal = ({ isOpen, onClose, order, onPaymentSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState("credit");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [payOrder] = usePayOrderMutation();

  if (!order) {
    return null;
  }

  const paymentMethods = [
    {
      id: "credit",
      name: "Credit Card",
      icon: FaCreditCard,
      description: "Pay with your credit or debit card"
    },
    {
      id: "upi",
      name: "UPI Payment",
      icon: FaMobile,
      description: "Pay using UPI apps like GPay, PhonePe"
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: FaTruck,
      description: "Pay when your order is delivered"
    }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    setError("");
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentDetails = {
        id: `mock_payment_${Date.now()}`,
        status: "completed",
        update_time: new Date().toISOString(),
        payer: {
          email_address: "customer@example.com"
        },
        method: selectedMethod
      };

      await payOrder({
        orderId: order._id,
        details: paymentDetails
      }).unwrap();
      setPaymentSuccess(true);
      
      // Auto close after success message
      setTimeout(() => {
        setPaymentSuccess(false);
        setIsProcessing(false);
        onPaymentSuccess();
        onClose();
      }, 2000);
      
    } catch (error) {
      setError(error.data?.message || "Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-gray-700 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">Complete Payment</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-400" />
          </button>
        </div>

        {paymentSuccess ? (
          /* Success State */
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-white text-2xl" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Payment Successful!</h4>
            <p className="text-gray-400">Your order has been paid successfully.</p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-3">Order Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Order ID:</span>
                  <span className="text-white font-mono text-sm">#{order._id.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Amount:</span>
                  <span className="text-white font-bold">₹{order.totalPrice}</span>
                </div>
              </div>
            </div>


            <div className="p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Select Payment Method</h4>
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedMethod === method.id
                          ? "border-white bg-gray-800"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedMethod === method.id}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center flex-1">
                        <div className={`p-2 rounded-lg mr-3 ${
                          selectedMethod === method.id ? "bg-white" : "bg-gray-800"
                        }`}>
                          <IconComponent className={`text-lg ${
                            selectedMethod === method.id ? "text-black" : "text-gray-400"
                          }`} />
                        </div>
                        <div>
                          <div className="text-white font-semibold">{method.name}</div>
                          <div className="text-gray-400 text-sm">{method.description}</div>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedMethod === method.id
                          ? "border-white bg-white"
                          : "border-gray-600"
                      }`}>
                        {selectedMethod === method.id && (
                          <div className="w-2 h-2 bg-black rounded-full m-0.5"></div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-gray-700">
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-700 text-gray-400 rounded-lg hover:bg-gray-800 transition-colors"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    `Pay ₹${order.totalPrice}`
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
