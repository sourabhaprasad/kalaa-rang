import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import { useGetCategoriesQuery } from "../../redux/api/categoryApiSlice";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { data: categories } = useGetCategoriesQuery();
  const favoriteCount = useSelector((state) => state.favorites.length) || 0;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Reusable Link Components
  const NavLinkItem = ({ to, icon: Icon, label, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors hover:bg-gray-800 rounded-lg"
    >
      {Icon && <Icon size={18} />}
      {label}
    </Link>
  );

  const DropdownItem = ({ to, label }) => (
    <Link
      to={to}
      onClick={() => setDropdownOpen(false)}
      className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm"
    >
      {label}
    </Link>
  );

  // 🔹 Admin Links (Ordered Cleanly)
  const adminLinks = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/categorylist", label: "Categories" },
    { to: "/admin/productlist", label: "Add a Product" },
    { to: "/admin/allproductslist", label: "All Products" },
    { to: "/admin/orderlist", label: "Orders" },
    { to: "/admin/userlist", label: "Users" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">KR</span>
            </div>
            <h1 className="text-xl font-bold text-white">Kalaa Rang</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLinkItem to="/" icon={AiOutlineHome} label="Home" />
            <NavLinkItem to="/shop" icon={AiOutlineShopping} label="Shop" />
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-2">
            <div className="relative flex items-center gap-4">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-300 hover:text-white transition-colors hover:bg-gray-800 rounded-lg"
              >
                <AiOutlineShoppingCart size={22} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </span>
                )}
              </Link>

              {/* Favorites */}
              <Link
                to="/favorite"
                className="relative p-2 text-gray-300 hover:text-white transition-colors hover:bg-gray-800 rounded-lg"
              >
                <FaHeart size={20} />
                {favoriteCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {favoriteCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {userInfo ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white transition-colors hover:bg-gray-800 rounded-lg"
                  >
                    <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-black font-medium text-sm">
                      {userInfo.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline">
                      {userInfo.username}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-black border border-gray-700 rounded-lg shadow-xl py-2 z-50">
                      <DropdownItem to="/profile" label="Profile" />

                      {userInfo.isAdmin && (
                        <>
                          <div className="border-t border-gray-700 my-2"></div>
                          {adminLinks.map((link) => (
                            <DropdownItem key={link.to} {...link} />
                          ))}
                        </>
                      )}

                      <div className="border-t border-gray-700 my-2"></div>
                      <button
                        onClick={() => {
                          logoutHandler();
                          setDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <NavLinkItem
                    to="/login"
                    icon={AiOutlineLogin}
                    label="Sign In"
                  />
                  <NavLinkItem
                    to="/register"
                    icon={AiOutlineUserAdd}
                    label="Sign Up"
                  />
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex items-center px-3 py-2 text-gray-300 hover:text-white transition-colors hover:bg-gray-800 rounded-lg"
              >
                {mobileMenuOpen ? (
                  <AiOutlineClose size={20} />
                ) : (
                  <AiOutlineMenu size={20} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4">
            <div className="space-y-2">
              <NavLinkItem
                to="/"
                icon={AiOutlineHome}
                label="Home"
                onClick={() => setMobileMenuOpen(false)}
              />
              <NavLinkItem
                to="/shop"
                icon={AiOutlineShopping}
                label="Shop"
                onClick={() => setMobileMenuOpen(false)}
              />

              {categories?.map((category) => (
                <NavLinkItem
                  key={category._id}
                  to={`/category/${category._id}`}
                  label={category.name}
                  onClick={() => setMobileMenuOpen(false)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;
