import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <div className="flex flex-col lg:flex-row justify-around m-[8rem]">
      <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4 p-2">
        {data.map((product) => (
          <SmallProduct key={product._id} product={product} />
        ))}
      </div>

      <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
        <ProductCarousel />
      </div>
    </div>
  );
};

export default Header;
