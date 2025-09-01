import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navigation />
      <main className="py-3 bg-black text-white min-h-screen">
        <Outlet />
      </main>
    </>
  );
};

export default App;
