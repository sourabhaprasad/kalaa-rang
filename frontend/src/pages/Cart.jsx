import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart) || { cartItems: [] };
  const { cartItems } = cart;

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const updateQuantityHandler = (item, newQty) => {
    if (newQty > 0) {
      dispatch(addToCart({ ...item, qty: newQty }));
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      
      <div className="relative z-10 container mx-auto px-6 py-12 pt-20">
        {/* Page Header */}
                <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-white mb-4">
            Shopping Cart
          </h1>
          <p className="text-gray-400 text-lg">Review your selected items</p>
          <div className="mt-6 h-px bg-gray-700"></div>
        </div>


        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-700">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-300 mb-4">Your cart is empty</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added any items to your cart yet. Start exploring our amazing products!</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-white text-black font-bold py-4 px-8 rounded-lg transition-colors hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="xl:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-black rounded-lg border border-gray-700 shadow-xl p-6 transition-all hover:bg-gray-900"
                >
                  <div className="flex items-center gap-6">
                    {/* Product Image */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white mb-2 truncate">{item.name}</h3>
                      <p className="text-2xl font-black text-white">
                        ₹{item.price}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantityHandler(item, item.qty - 1)}
                        className="p-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
                      >
                        <FaMinus className="text-gray-400" size={12} />
                      </button>
                      
                      <div className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg">
                        <span className="text-white font-bold">{item.qty}</span>
                      </div>
                      
                      <button
                        onClick={() => updateQuantityHandler(item, item.qty + 1)}
                        className="p-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
                      >
                        <FaPlus className="text-gray-400" size={12} />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCartHandler(item._id)}
                      className="p-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors"
                    >
                      <FaTrash className="text-red-400" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="xl:col-span-1">
              <div className="sticky top-8 bg-black rounded-lg border border-gray-700 shadow-xl p-8">
                
                <div className="relative">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <div className="p-2 bg-gray-800 rounded-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    Order Summary
                  </h2>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <span className="text-gray-400">Items ({cartItems.length}):</span>
                      <span className="text-white font-semibold">
                        ₹{cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b border-gray-700">
                      <span className="text-gray-400">Shipping:</span>
                      <span className="text-green-400 font-semibold">Free</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-4">
                      <span className="text-xl font-bold text-white">Total:</span>
                      <span className="text-2xl font-black text-white">
                        ₹{cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-white text-black font-bold py-4 px-6 rounded-lg transition-colors hover:bg-gray-100">
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Proceed to Checkout
                    </span>
                  </button>
                  
                  <Link
                    to="/shop"
                    className="block text-center mt-4 text-white hover:text-gray-300 font-semibold transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
