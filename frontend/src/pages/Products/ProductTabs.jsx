import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/loader";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data: topProducts, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) return <Loader />;

  const tabs = [
    { id: 1, label: "Write Your Review" },
    { id: 2, label: "All Reviews" },
    { id: 3, label: "Related Products" },
  ];

  return (
    <div className="flex flex-col md:flex-row  border-white/40 border-white/20 rounded-lg p-5 bg-[#121212]">
      {/* Tab Headers */}
      <aside className="flex md:flex-col mb-4 md:mb-0 md:mr-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 mb-2 md:mb-4 text-lg font-medium rounded-lg focus:outline-none transition-colors ${
              activeTab === tab.id
                ? "bg-purple-600 text-white"
                : "text-purple-400 hover:bg-purple-700 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </aside>

      {/* Tab Content */}
      <section className="flex-1">
        {/* Write Review */}
        {activeTab === 1 && (
          <div className="mt-2">
            {userInfo ? (
              <form onSubmit={submitHandler} className="space-y-4">
                <div>
                  <label htmlFor="rating" className="block mb-1 text-lg">
                    Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="p-2 rounded-lg border border-white/40 w-full max-w-md"
                  >
                    <option value="">Select</option>
                    <option value="1">Inferior</option>
                    <option value="2">Decent</option>
                    <option value="3">Great</option>
                    <option value="4">Excellent</option>
                    <option value="5">Exceptional</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="comment" className="block mb-1 text-lg">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows="4"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="p-2 border border-white/40 rounded-lg w-full max-w-md text-white bg-[#1A1A1A]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Submit
                </button>
              </form>
            ) : (
              <p>
                Please{" "}
                <Link to="/login" className="text-purple-400 underline">
                  sign in
                </Link>{" "}
                to write a review.
              </p>
            )}
          </div>
        )}

        {/* All Reviews */}
        {activeTab === 2 && (
          <div className="space-y-4 mt-2">
            {product.reviews.length === 0 && (
              <p className="text-lg font-medium">No Reviews</p>
            )}
            {product.reviews.map((review) => (
              <div
                key={review._id}
                className="bg-[#1A1A1A] p-4 rounded-lg w-full max-w-2xl"
              >
                <div className="flex justify-between mb-2">
                  <strong className="text-[#B0B0B0]">{review.name}</strong>
                  <span className="text-[#B0B0B0]">
                    {review.createdAt.substring(0, 10)}
                  </span>
                </div>
                <p className="mb-2">{review.comment}</p>
                <Ratings value={review.rating} />
              </div>
            ))}
          </div>
        )}

        {/* Related Products */}
        {activeTab === 3 && (
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {topProducts?.map((prod) => (
              <SmallProduct key={prod._id} product={prod} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductTabs;
