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
    <div className="mx-10 mt-10 text-white flex flex-col gap-10">
      <Link
        to="/"
        className="text-white font-semibold hover:underline mb-4 ml-[3rem]"
      >
        &larr; Go Back
      </Link>

      {/* Top: Image & Main Details */}
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="relative lg:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[40rem] object-contain rounded-lg"
          />
          <HeartIcon product={product} />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-3xl font-bold">{product.name}</h2>
          <p className="text-white/80">{product.description}</p>
          <div className="flex justify-between items-center flex-wrap mt-4 gap-4">
            {/* Ratings */}
            <Ratings
              value={product.rating}
              text={`${product.numReviews} reviews`}
            />

            {/* Quantity Dropdown */}
            {product.countInStock > 0 && (
              <div>
                <select
                  id="qty"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="p-2 w-[6rem] rounded-lg text-black"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-8 flex-wrap mt-4">
            <div>
              <p className="flex items-center gap-2">
                <FaClock /> Added: {moment(product.createAt).fromNow()}
              </p>
              <p className="flex items-center gap-2">
                <FaStar /> Reviews: {product.numReviews}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-2">
                <FaStar /> Rating: {product.rating}
              </p>
              <p className="flex items-center gap-2">
                <FaShoppingCart /> Quantity: {product.quantity}
              </p>
              <p className="flex items-center gap-2">
                <FaBox /> In Stock: {product.countInStock}
              </p>
            </div>
          </div>

          <p className="text-4xl font-extrabold my-4">₹{product.price}</p>

          {/* Add to Cart */}
          {product.countInStock > 0 && (
            <div className="my-4 flex items-center gap-4">
              <label htmlFor="qty" className="font-medium">
                Qty:
              </label>
              <div className="relative">
                <select
                  id="qty"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="appearance-none bg-gray-800 text-white p-2 rounded pr-8 w-20"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
                {/* Down Arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                  ▼
                </div>
              </div>
            </div>
          )}

          <button
            onClick={addToCartHandler}
            disabled={product.countInStock === 0}
            className="bg-purple-600 hover:bg-purple-700 transition-colors text-white px-6 py-2 rounded font-semibold w-fit"
          >
            Add To Cart
          </button>
        </div>
      </div>

      {/* Bottom: Reviews & Tabs */}
      <div className="mt-10 ml-[4rem]">
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
  );
};

export default ProductDetails;
