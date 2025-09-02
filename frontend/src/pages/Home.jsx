import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/loader";
import Message from "../components/Message";
import Header from "../components/Header";
import SmallProduct from "./Products/SmallProduct";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  let content;

  if (isLoading) {
    content = (
      <div className="flex justify-center items-center py-32">
        <Loader />
      </div>
    );
  } else if (isError) {
    content = (
      <div className="flex justify-center items-center py-32">
        <Message variant="danger">
          {isError?.data?.message || isError.error}
        </Message>
      </div>
    );
  } else {
    content = (
      <div className="min-h-screen bg-black relative overflow-hidden">

        <div className="relative z-10 container mx-auto px-4 pt-24 pb-8">
          {/* Hero Section */}
          <div className="text-center mb-16 pt-8">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white">
              Kalaa Rang
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover a world of vibrant colors and premium quality products
              crafted with passion and precision
            </p>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link
              to="/shop"
              className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-2xl transition-all duration-300 hover:from-violet-500 hover:to-purple-500 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25 border border-violet-400/30"
            >
              <span className="relative z-10">Explore Collection</span>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            </Link>
            <Link
              to="/favorite"
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-2xl transition-all duration-300 hover:from-cyan-500 hover:to-blue-500 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 border border-cyan-400/30"
            >
              <span className="relative z-10">View Favorites</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            </Link>
          </div>

          {/* Featured Products Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Featured Products</h2>
              <p className="text-gray-400 text-lg">Handpicked selections from our premium collection</p>
              <div className="mt-6 h-px bg-gray-700"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 place-items-center">
              {data.products.slice(0, 8).map((product) => (
                <SmallProduct key={product._id} product={product} />
              ))}
            </div>

            {/* View All Products Link */}
            <div className="text-center mt-12">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 font-semibold transition-colors duration-300"
              >
                View All Products
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Features Section */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Premium Quality</h3>
              <p className="text-gray-400">Carefully curated products with exceptional craftsmanship</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Fast Delivery</h3>
              <p className="text-gray-400">Quick and secure shipping to your doorstep</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-rose-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Customer Love</h3>
              <p className="text-gray-400">Trusted by thousands of satisfied customers</p>
            </div>
          </div> */}
        </div>
      </div>
    );
  }

  return (
    <>
      {!keyword && <Header />}
      {content}
    </>
  );
};

export default Home;
