import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ProductCarousel.css";
import moment from "moment";
import { FaBox, FaClock, FaShoppingCart, FaStar } from "react-icons/fa";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // Extract rendering logic for clarity
  let content;
  if (isLoading) {
    return (
      <div className="relative bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/30 shadow-xl overflow-hidden">
        <Message variant="danger">
          {error?.data?.message || error.error || "Something went wrong!"}
        </Message>
      </div>
    );
  } else if (error) {
    content = (
      <Message variant="danger">
        {error?.data?.message || error.error || "Something went wrong!"}
      </Message>
    );
  } else {
    content = (
      <div className="relative bg-gradient-to-br from-gray-900/30 to-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/30 shadow-xl overflow-hidden p-6">
        <Slider {...settings} className="w-full max-w-[36rem] mx-auto sm:block">
          {products.map((product) => (
            <div key={product._id} className="px-2">
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full object-cover h-[16rem] sm:h-[20rem] md:h-[24rem] transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              <div className="mt-6 flex flex-col md:flex-row justify-between gap-4">
                {/* Product Info */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-2">{product.name}</h2>
                  <p className="text-2xl font-black bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-3">
                    ₹{product.price}
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {product.description.substring(0, 140)}...
                  </p>
                </div>

                {/* Stats */}
                <div className="flex-1 flex flex-col md:flex-row justify-between text-sm mt-4 md:mt-0 gap-6">
                  <div className="space-y-2">
                    <p className="flex items-center text-gray-400">
                      <FaClock className="mr-2 text-violet-400" />
                      {moment(product.createdAt).fromNow()}
                    </p>
                    <p className="flex items-center text-gray-400">
                      <FaStar className="mr-2 text-yellow-400" /> 
                      {product.numReviews} Reviews
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="flex items-center text-gray-400">
                      <FaStar className="mr-2 text-yellow-400" /> 
                      {Math.round(product.rating)}/5 Rating
                    </p>
                    <p className="flex items-center text-gray-400">
                      <FaBox className="mr-2 text-cyan-400" /> 
                      {product.countInStock} In Stock
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    );
  }

  return <div className="mb-8">{content}</div>;
};

export default ProductCarousel;
