import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaArrowLeft, FaShoppingCart, FaMapMarkerAlt } from "react-icons/fa";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress } = cart;
  
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  
  const [orderData, setOrderData] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "India"
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const taxPrice = Number((0.18 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  const handleInputChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async () => {
    console.log("Place Order clicked");
    console.log("Form valid:", isFormValid);
    console.log("Order data:", orderData);
    console.log("Cart items:", cartItems);
    
    try {
      const order = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          _id: item._id || item.product || item.id
        })),
        shippingAddress: orderData,
        paymentMethod: "pending",
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
      };

      const result = await createOrder(order).unwrap();
      
      navigate(`/orders/${result._id}`);
      
      setTimeout(() => {
        dispatch(clearCartItems());
      }, 500);
      
    } catch (error) {
      alert(`Error creating order: ${error.data?.error || error.message}`);
    }
  };

  const isFormValid = orderData.address && orderData.city && orderData.postalCode;

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-12 pt-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/cart")}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Place Order</h1>
            <p className="text-gray-400">Review your order and complete checkout</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-black border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaMapMarkerAlt />
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={orderData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none"
                    placeholder="Enter your full address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={orderData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none"
                    placeholder="City"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={orderData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none"
                    placeholder="PIN Code"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={orderData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-white focus:outline-none"
                    placeholder="Country"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-black border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaShoppingCart />
                Order Items ({cartItems.length})
              </h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
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
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-black border border-gray-700 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Items ({cartItems.length}):</span>
                  <span className="text-white">₹{itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping:</span>
                  <span className="text-white">
                    {shippingPrice === 0 ? "Free" : `₹${shippingPrice}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax (GST 18%):</span>
                  <span className="text-white">₹{taxPrice}</span>
                </div>
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="text-xl font-bold text-white">Total:</span>
                    <span className="text-xl font-bold text-white">₹{totalPrice}</span>
                  </div>
                </div>
              </div>

              {shippingPrice === 0 && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-6">
                  <p className="text-green-400 text-sm">
                    🎉 Free shipping on orders above ₹500!
                  </p>
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={!isFormValid || isLoading}
                className="w-full bg-white text-black font-bold py-4 px-6 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Creating Order...
                  </div>
                ) : (
                  `Place Order - ₹${totalPrice}`
                )}
              </button>

              <p className="text-gray-400 text-sm mt-4 text-center">
                You'll be redirected to payment after placing the order
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
