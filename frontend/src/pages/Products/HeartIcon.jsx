import { useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
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
  const favorites = useSelector((state) => state.favorites) || [];

  // Make sure only valid products in favorites are checked
  const isFavorite = favorites.some((p) => p?._id && p._id === product._id);

  useEffect(() => {
    const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
    // Filter out invalid entries from localStorage
    const validFavorites = favoritesFromLocalStorage.filter((p) => p?._id);
    dispatch(setFavorites(validFavorites));
  }, [dispatch]);

  const toggleFavorites = (e) => {
    e.preventDefault();
    e.stopPropagation();

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
      className="absolute top-2 right-5 cursor-pointer"
      onClick={toggleFavorites}
    >
      {isFavorite ? (
        <FaHeart className="text-pink-500" />
      ) : (
        <FaRegHeart className="text-white" />
      )}
    </div>
  );
};

export default HeartIcon;
