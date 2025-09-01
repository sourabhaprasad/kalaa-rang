import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
    content = <div className="text-center py-10">Loading...</div>;
  } else if (error) {
    content = (
      <Message variant="danger">
        {error?.data?.message || error.error || "Something went wrong!"}
      </Message>
    );
  } else {
    content = (
      <Slider {...settings} className="w-full max-w-[36rem] mx-auto sm:block">
        {products.map((product) => (
          <div key={product._id} className="px-2">
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-lg object-cover h-[16rem] sm:h-[20rem] md:h-[24rem]"
            />

            <div className="mt-4 flex flex-col md:flex-row justify-between gap-4">
              {/* Product Info */}
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
                <p className="text-purple-600 font-bold mb-2">
                  ₹{product.price}
                </p>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {product.description.substring(0, 140)}...
                </p>
              </div>

              {/* Stats */}
              <div className="flex-1 flex flex-col md:flex-row justify-between text-sm mt-2 md:mt-0 gap-4">
                <div>
                  <p className="flex items-center mb-1">
                    <FaClock className="mr-2 text-gray-500" />
                    {moment(product.createdAt).fromNow()}
                  </p>
                  <p className="flex items-center mb-1">
                    <FaStar className="mr-2 text-yellow-500" /> Reviews:{" "}
                    {product.numReviews}
                  </p>
                </div>

                <div>
                  <p className="flex items-center mb-1">
                    <FaStar className="mr-2 text-yellow-500" /> Rating:{" "}
                    {Math.round(product.rating)}
                  </p>
                  <p className="flex items-center mb-1">
                    <FaShoppingCart className="mr-2 text-gray-500" /> Qty:{" "}
                    {product.quantity}
                  </p>
                  <p className="flex items-center mb-1">
                    <FaBox className="mr-2 text-gray-500" /> In Stock:{" "}
                    {product.countInStock}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    );
  }

  return <div className="mb-6">{content}</div>;
};

export default ProductCarousel;
