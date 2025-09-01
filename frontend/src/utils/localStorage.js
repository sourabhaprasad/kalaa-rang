export const addFavoriteToLocalStorage = (product) => {
  if (!product || !product._id) return;

  const favorites = getFavoritesFromLocalStorage().filter(Boolean);
  if (!favorites.some((p) => p._id === product._id)) {
    favorites.push(product);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
};

export const removeFavoriteFromLocalStorage = (productId) => {
  if (!productId) return;

  const favorites = getFavoritesFromLocalStorage().filter(Boolean);
  const updateFavorites = favorites.filter(
    (product) => product._id !== productId
  );
  localStorage.setItem("favorites", JSON.stringify(updateFavorites));
};

export const getFavoritesFromLocalStorage = () => {
  try {
    const favoritesJSON = localStorage.getItem("favorites");
    const parsed = favoritesJSON ? JSON.parse(favoritesJSON) : [];
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch (error) {
    return [];
  }
};
