import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-full sm:w-[18rem] md:w-[20rem] p-3 mx-auto ml-[5rem] cursor-pointer">
      <Link
        to={`/product/${product._id}`}
        className="block hover:scale-105 transition-transform duration-300"
      >
        <div className="relative group">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[18rem] sm:h-[20rem] md:h-[22rem] rounded object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <HeartIcon product={product} />
        </div>

        <div className="p-3">
          <h2 className="flex justify-between items-center text-sm sm:text-base font-medium">
            <span className="truncate">{product.name}</span>
            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-purple-900 dark:text-purple-300">
              ₹{product.price}
            </span>
          </h2>
        </div>
      </Link>
    </div>
  );
};

export default SmallProduct;
