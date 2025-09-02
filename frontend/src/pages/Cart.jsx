import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
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
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-xl mb-4">Your cart is empty</p>
            <Link
              to="/shop"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-400">₹{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          updateQuantityHandler(item, item.qty - 1)
                        }
                        className="px-2 py-1 bg-gray-600 rounded hover:bg-gray-700"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 bg-gray-700 rounded">
                        {item.qty}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantityHandler(item, item.qty + 1)
                        }
                        className="px-2 py-1 bg-gray-600 rounded hover:bg-gray-700"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCartHandler(item._id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Items ({cartItems.length}):</span>
                    <span>
                      ₹
                      {cartItems
                        .reduce((acc, item) => acc + item.price * item.qty, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-semibold">
                      ₹
                      {cartItems
                        .reduce((acc, item) => acc + item.price * item.qty, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                </div>
                <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
