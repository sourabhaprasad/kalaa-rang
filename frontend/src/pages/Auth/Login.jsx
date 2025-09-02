import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loader from "../../components/loader";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();
      console.log(res);
      dispatch(setCredentials({ ...res }));
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 pt-20">

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="bg-black rounded-lg border border-gray-700 shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-400">Sign in to your account</p>
            </div>

            <form onSubmit={submitHandler} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full p-4 bg-gradient-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-sm rounded-2xl border border-gray-600/50 text-white placeholder-gray-400 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/20 transition-all duration-300"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  className="w-full p-4 bg-gradient-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-sm rounded-2xl border border-gray-600/50 text-white placeholder-gray-400 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/20 transition-all duration-300"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-8 py-4 bg-white text-black font-bold rounded-lg transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>

              {isLoading && (
                <div className="flex justify-center">
                  <Loader />
                </div>
              )}
            </form>

            {/* Register Link */}
            <div className="text-center mt-6 pt-6 border-t border-gray-700">
              <p className="text-gray-400">
                New to Kalaa Rang?{" "}
                <Link
                  to={redirect ? `/register?redirect=${redirect}` : "/register"}
                  className="text-white hover:text-gray-300 font-medium transition-colors"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right - Branding */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center">
          <div className="relative">
            <div className="w-64 h-64 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-full flex items-center justify-center mb-8 backdrop-blur-xl border border-violet-400/30">
              <img src="/logo.png" alt="Kalaa Rang Logo" className="w-32 h-32 object-contain" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-600/10 rounded-full blur-2xl"></div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Kalaa Rang
          </h2>
          <p className="text-gray-400 text-lg max-w-md leading-relaxed">
            Discover extraordinary products crafted with passion and designed to elevate your everyday experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
