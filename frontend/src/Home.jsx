import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "./redux/api/productApiSlice";
import Loader from "./components/loader";
import Message from "./components/Message";
import Header from "./components/Header";
import SmallProduct from "./pages/Products/SmallProduct";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  let content;

  if (isLoading) {
    content = <Loader />;
  } else if (isError) {
    content = (
      <Message variant="danger">
        {isError?.data?.message || isError.error}
      </Message>
    );
  } else {
    content = (
      <>
        <div className="flex justify-between items-center">
          <h1 className="ml-[20rem] mt-[10rem] text-[3rem]">
            Special Products
          </h1>

          <Link
            to="/shop"
            className="bg-purple-600 font-bold rounded-full py-2 px-10 mr-[18rem] mt-[10rem]"
          >
            Shop
          </Link>
        </div>

        <div className="flex justify-center flex-wrap mt-[2rem]">
          {data.products.map((product) => (
            <div key={product._id}>
              <SmallProduct product={product} />
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {!keyword && <Header />}
      {content}
    </>
  );
};

export default Home;
