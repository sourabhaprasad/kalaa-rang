import { Link } from "react-router-dom";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  if (isLoading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-xl">Loading products...</div>
    </div>
  );
  if (isError) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-red-400 text-xl">Error loading products</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 pt-20">
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Manage Products
          </h1>
          <p className="text-gray-400">Update and manage your product catalog ({products.length} products)</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              className="bg-black rounded-lg border border-gray-700 shadow-xl overflow-hidden transition-all hover:bg-gray-900"
              key={product._id}
            >
              <div className="w-full aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <h5 className="text-lg font-bold text-white">{product.name}</h5>
                  <p className="text-gray-400 text-sm">
                    {product.description?.substring(0, 80)}...
                  </p>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                    <span className="text-xl font-bold text-white">₹{product.price}</span>
                    <Link
                      to={`/admin/product/update/${product._id}`}
                      className="bg-white/80 text-black font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                    >
                      Update Product
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
