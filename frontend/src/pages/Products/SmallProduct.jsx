import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="group relative w-[280px] h-[380px] perspective-1000">
      {/* Main Card Container */}
      <div className="relative w-full h-full bg-black rounded-lg shadow-xl border border-gray-700 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        
        
        <Link to={`/product/${product._id}`} className="block h-full">
          {/* Image Section */}
          <div className="relative h-[240px] overflow-hidden rounded-t-lg">
            
            {/* Product Image */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-110"
            />
            
            {/* Subtle Overlay */}
          </div>

          {/* Content Section */}
          <div className="relative p-5 flex flex-col justify-between h-[140px]">
            {/* Decorative Line */}
            <div className="absolute top-0 left-5 right-5 h-px bg-gray-700"></div>
            
            {/* Product Title */}
            <h3 className="text-base font-bold text-white leading-tight line-clamp-2 mb-3">
              {product.name}
            </h3>
            
            {/* Price */}
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xl font-black text-white">
                ₹{product.price}
              </span>
            </div>
          </div>
        </Link>

        <HeartIcon product={product} />

      </div>
    </div>
  );
};

export default SmallProduct;
