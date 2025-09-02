import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/loader";
import Message from "../../components/Message";
import { FaBox, FaClock, FaShoppingCart, FaStar } from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error("Please login to write a review");
      navigate("/login");
      return;
    }
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Review created successfully");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    if (!userInfo) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || error.message}
      </Message>
    );

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-6 py-12 pt-20">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white hover:text-gray-300 font-semibold transition-colors mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Product Details */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="relative group">
            <div className="relative bg-black rounded-lg border border-gray-700 shadow-xl overflow-hidden p-8">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[500px] object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
              />
              <HeartIcon product={product} />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-4xl font-black text-white leading-tight">
                {product.name}
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Price */}
            <div className="bg-black rounded-lg border border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <span className="text-5xl font-black text-white">
                  ₹{product.price}
                </span>
                <div className="text-right">
                  <Ratings value={product.rating} text={`${product.numReviews} reviews`} />
                </div>
              </div>
            </div>

            {/* Product Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black rounded-lg border border-gray-700 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-800 rounded-lg">
                    <FaClock className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Added</p>
                    <p className="text-white font-semibold">{moment(product.createAt).fromNow()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-black rounded-lg border border-gray-700 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-800 rounded-lg">
                    <FaBox className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">In Stock</p>
                    <p className="text-white font-semibold">{product.countInStock}</p>
                  </div>
                </div>
              </div>

              <div className="bg-black rounded-lg border border-gray-700 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-800 rounded-lg">
                    <FaStar className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Rating</p>
                    <p className="text-white font-semibold">{product.rating}/5</p>
                  </div>
                </div>
              </div>

              <div className="bg-black rounded-lg border border-gray-700 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-800 rounded-lg">
                    <FaShoppingCart className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Reviews</p>
                    <p className="text-white font-semibold">{product.numReviews}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            {product.countInStock > 0 && (
              <div className="bg-black rounded-lg border border-gray-700 p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <label className="text-white font-semibold">Quantity:</label>
                  <div className="relative">
                    <select
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="appearance-none bg-gray-800 border border-gray-700 rounded-lg text-white px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  onClick={addToCartHandler}
                  className="w-full bg-white hover:bg-gray-100 text-black font-bold py-4 px-8 rounded-lg transition-colors"
                >
                  <span className="flex items-center justify-center gap-2">
                    <FaShoppingCart />
                    Add to Cart
                  </span>
                </button>
              </div>
            )}

            {product.countInStock === 0 && (
              <div className="bg-black rounded-lg border border-gray-700 p-6 text-center">
                <p className="text-gray-400 font-semibold text-lg">Out of Stock</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews & Tabs */}
        <div className="bg-black rounded-lg border border-gray-700 shadow-xl overflow-hidden">
          <ProductTabs
            loadingProductReview={loadingProductReview}
            userInfo={userInfo}
            submitHandler={submitHandler}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            product={product}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
