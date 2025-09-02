import { useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  addToFavorites,
  removeFromFavorites,
  setFavorites,
} from "../../redux/features/favorites/favoriteSlice";

import {
  addFavoriteToLocalStorage,
  getFavoritesFromLocalStorage,
  removeFavoriteFromLocalStorage,
} from "../../utils/localStorage";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favorites = useSelector((state) => state.favorites) || [];
  const { userInfo } = useSelector((state) => state.auth);

  const isFavorite = favorites.some((p) => p?._id && p._id === product._id);

  useEffect(() => {
    const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
    const validFavorites = favoritesFromLocalStorage.filter((p) => p?._id);
    dispatch(setFavorites(validFavorites));
  }, [dispatch]);

  const toggleFavorites = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userInfo) {
      toast.error("Please login to add favorites");
      navigate("/login");
      return;
    }

    if (!product?._id) return;

    if (isFavorite) {
      dispatch(removeFromFavorites(product));
      removeFavoriteFromLocalStorage(product._id);
    } else {
      dispatch(addToFavorites(product));
      addFavoriteToLocalStorage(product);
    }
  };

  return (
    <div
      className="absolute top-4 right-4 z-30 cursor-pointer group/heart"
      onClick={toggleFavorites}
    >
      <div className="relative p-2.5 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-md rounded-2xl border border-gray-600/30 hover:border-pink-400/50 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/20">
        {isFavorite ? (
          <FaHeart className="text-pink-400 drop-shadow-lg transition-all duration-300 group-hover/heart:text-pink-300 group-hover/heart:scale-110" size={16} />
        ) : (
          <FaRegHeart className="text-gray-300 transition-all duration-300 group-hover/heart:text-pink-400 group-hover/heart:scale-110" size={16} />
        )}
        
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/0 to-rose-500/0 group-hover/heart:from-pink-500/10 group-hover/heart:to-rose-500/10 transition-all duration-300"></div>
      </div>
    </div>
  );
};

export default HeartIcon;
