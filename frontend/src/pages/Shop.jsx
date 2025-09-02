import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useGetCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useGetCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading && categoriesQuery.data) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, categoriesQuery.isLoading, dispatch]);

  useEffect(() => {
    if (filteredProductsQuery.data) {
      const filteredProducts = filteredProductsQuery.data.filter((p) => {
        return (
          p.price.toString().includes(priceFilter) ||
          p.price === parseInt(priceFilter, 10)
        );
      });

      dispatch(setProducts(filteredProducts));
    }
  }, [filteredProductsQuery.data, priceFilter, dispatch]);

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const handlePriceChange = (e) => {
    // Update the price filter state when the user types in the input filed
    setPriceFilter(e.target.value);
  };

  return (
    <div className="min-h-screen bg-black relative">
      
      <div className="relative z-10 container mx-auto px-6 py-12 pt-20">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-white mb-4">
            Discover Amazing Products
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore our curated collection of premium items designed to elevate your lifestyle
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-12">
          {/* Enhanced Filters Sidebar */}
          <aside className="xl:w-64 flex-shrink-0">
            <div className="sticky top-8 space-y-8">
              {/* Categories Filter */}
              <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                <div className="bg-gray-800 px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-gray-700 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                      </svg>
                    </div>
                    Categories
                  </h2>
                </div>

                <div className="p-6 space-y-4 max-h-80 overflow-y-auto">
                  {categories?.map((c) => (
                    <label key={c._id} className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-gray-800 transition-colors">
                      <div className="relative">
                        <input
                          type="checkbox"
                          onChange={(e) => handleCheck(e.target.checked, c._id)}
                          className="w-4 h-4 text-white bg-gray-800 border-gray-600 rounded focus:ring-white focus:ring-1"
                        />
                      </div>
                      <span className="ml-3 text-gray-300 font-medium hover:text-white transition-colors">
                        {c.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                <div className="bg-gray-800 px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-gray-700 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    Price Range
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter maximum price..."
                      value={priceFilter}
                      onChange={handlePriceChange}
                      className="w-full p-3 bg-gray-800 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <button
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors border border-gray-600"
                onClick={() => window.location.reload()}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset Filters
                </span>
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Products Header */}
            <div className="mb-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Product Collection
                  </h2>
                  <p className="text-gray-400">Handpicked items just for you</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-gray-900 px-4 py-2 rounded-lg border border-gray-700">
                    <span className="text-gray-400 text-sm">Found</span>
                    <div className="px-3 py-1 bg-white text-black font-bold rounded text-sm">
                      {products?.length || 0}
                    </div>
                    <span className="text-gray-400 text-sm">items</span>
                  </div>
                </div>
              </div>
              
              <div className="h-px bg-gray-700"></div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 place-items-center">
              {!products || products.length === 0 ? (
                <div className="col-span-full flex justify-center items-center py-32">
                  <Loader />
                </div>
              ) : (
                products?.map((p) => (
                  <ProductCard key={p._id} p={p} />
                ))
              )}
            </div>

            {/* Empty State */}
            {products && products.length === 0 && (
              <div className="col-span-full text-center py-32">
                <div className="mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-300 mb-4">No products found</h3>
                <p className="text-gray-500 max-w-md mx-auto">Try adjusting your filters or search criteria to discover more amazing products</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
