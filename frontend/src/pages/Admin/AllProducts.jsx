import { Link } from "react-router-dom";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading products</div>;

  return (
    <div className="container mx-[9rem]">
      <div className="flex flex-col md:flex-row">
        <div className="p-3 md:w-3/4">
          <div className="ml-[2rem] text-xl font-bold h-12 mb-4">
            All Products ({products.length})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                className="flex flex-col shadow-md rounded-md overflow-hidden"
                key={product._id}
              >
                <div className="w-full aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start">
                    <h5 className="text-lg font-semibold">{product.name}</h5>
                  </div>
                  <p className="text-gray-500 text-sm">
                    {product.description?.substring(0, 80)}...
                  </p>
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/admin/product/update/${product._id}`}
                      className="btn text-xs flex items-center"
                    >
                      Update
                      <svg
                        className="w-3.5 h-3.5 ml-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </Link>
                    <p className="font-semibold">₹ {product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="md:w-1/4 p-3 mt-2">
          <AdminMenu />
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
