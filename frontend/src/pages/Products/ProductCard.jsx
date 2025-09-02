import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully");
  };

  return (
    <div className="w-[220px] h-[380px] relative bg-[#1A1A1A] rounded-lg shadow-md flex flex-col justify-between">
      <section className="relative">
        <Link to={`/product/${p._id}`}>
          <span className="absolute bottom-3 right-3 bg-pink-100 text-pink-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
            {p?.brand}
          </span>
          <img
            className="cursor-pointer w-full h-[170px] object-cover rounded-t-lg"
            src={p.image}
            alt={p.name}
          />
        </Link>
        <HeartIcon product={p} />
      </section>

      <div className="p-3 flex flex-col justify-between flex-1">
        <div className="flex justify-between items-start mb-2">
          <h5 className="text-sm font-semibold text-white line-clamp-2">
            {p?.name}
          </h5>
          <p className="text-pink-500 font-semibold text-sm">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>

        <p className="text-[#CFCFCF] text-xs line-clamp-3 mb-3">
          {p?.description}
        </p>

        <section className="flex justify-between items-center mt-auto">
          <Link
            to={`/product/${p._id}`}
            className="text-xs px-2 py-1 bg-purple-700 rounded hover:bg-purple-800 text-white"
          >
            Read More
          </Link>

          <button
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
            onClick={() => addToCartHandler(p, 1)}
          >
            <AiOutlineShoppingCart size={20} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;
