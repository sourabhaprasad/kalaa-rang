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
    <div className="relative bg-black rounded-lg border border-gray-700 shadow-xl overflow-hidden">
      
      <div className="flex flex-col lg:flex-row p-8">
        {/* Tab Headers */}
        <aside className="flex lg:flex-col mb-6 lg:mb-0 lg:mr-12 lg:min-w-[240px]">
          <div className="flex lg:flex-col gap-3 w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-left font-medium rounded-lg transition-colors border ${
                  activeTab === tab.id
                    ? "bg-white text-black border-white"
                    : "text-gray-300 hover:text-white border-gray-700 hover:bg-gray-800"
                }`}
              >
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Tab Content */}
        <section className="flex-1 relative">
          {/* Write Review */}
          {activeTab === 1 && (
            <div className="space-y-6">
              {userInfo ? (
                <form onSubmit={submitHandler} className="space-y-6">
                  <div>
                    <label htmlFor="rating" className="block mb-3 text-lg font-medium text-gray-200">
                      Rating
                    </label>
                    <select
                      id="rating"
                      required
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full max-w-md p-4 bg-gray-800 rounded-lg border border-gray-700 text-white focus:border-white focus:ring-2 focus:ring-white transition-all"
                    >
                      <option value="">Select Rating</option>
                      <option value="1">Inferior</option>
                      <option value="2">Decent</option>
                      <option value="3">=Great</option>
                      <option value="4"> Excellent</option>
                      <option value="5">Exceptional</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="comment" className="block mb-3 text-lg font-medium text-gray-200">
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      rows="6"
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts about this product..."
                      className="w-full max-w-2xl p-4 bg-gray-800 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:border-white focus:ring-2 focus:ring-white transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loadingProductReview}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-lg transition-colors hover:bg-gray-100"
                  >
                    {loadingProductReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-lg mb-4">
                    Please{" "}
                    <Link to="/login" className="text-white hover:text-gray-300 underline transition-colors">
                      sign in
                    </Link>{" "}
                    to write a review.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* All Reviews */}
          {activeTab === 2 && (
            <div className="space-y-6">
              {product.reviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-300 text-lg">No reviews yet. Be the first to review this product!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {product.reviews.map((review) => (
                    <div
                      key={review._id}
                      className="group bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 hover:border-gray-600/50 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-white font-medium text-lg">{review.name}</h4>
                          <div className="mt-2">
                            <Ratings value={review.rating} />
                          </div>
                        </div>
                        <span className="text-gray-400 text-sm bg-gray-800/50 px-3 py-1 rounded-full">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Related Products */}
          {activeTab === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-6">Related Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {topProducts?.map((prod) => (
                  <SmallProduct key={prod._id} product={prod} />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProductTabs;
