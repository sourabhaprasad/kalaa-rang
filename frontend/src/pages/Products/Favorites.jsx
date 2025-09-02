import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import SmallProduct from "./SmallProduct";
import { Link } from "react-router-dom";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your Favorites</h1>
          <p className="text-gray-600 mb-6">
            You haven't added any products to your favorites yet.
          </p>
          <Link
            to="/shop"
            className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-300 hover:text-black transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Your Favorites ({favorites.length})
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {favorites.map((product) => (
          <div key={product._id}>
            <SmallProduct product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
