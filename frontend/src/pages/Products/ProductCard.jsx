import { Link, useNavigate } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const addToCartHandler = (product, qty) => {
    if (!userInfo) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully");
  };

  return (
    <div className="group relative w-[300px] h-[460px] perspective-1000">
      <div className="relative w-full h-full bg-black rounded-lg shadow-xl border border-gray-700 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        <div className="relative h-[220px] overflow-hidden rounded-t-lg">
          <Link to={`/product/${p._id}`}>
            <img
              className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-110"
              src={p.image}
              alt={p.name}
            />
          </Link>
          
          <HeartIcon product={p} />
        </div>

        <div className="relative p-6 space-y-5 flex flex-col h-[240px]">
          <div className="absolute top-0 left-6 right-6 h-px bg-gray-700"></div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">
              {p?.name}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-white">
                {p?.price?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "INR",
                })}
              </span>
            </div>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 flex-grow">
            {p?.description}
          </p>
          <div className="flex items-center gap-3 mt-auto">
            <Link
              to={`/product/${p._id}`}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors border border-gray-700 text-center text-sm"
            >
              View Details
            </Link>

            <button
              className="p-3.5 bg-white hover:bg-gray-100 text-black rounded-lg transition-colors"
              onClick={() => addToCartHandler(p, 1)}
              title="Add to Cart"
            >
              <AiOutlineShoppingCart size={20} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
