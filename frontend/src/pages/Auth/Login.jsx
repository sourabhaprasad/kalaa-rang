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
    <section className="flex min-h-screen">
      {/* Left form */}
      <div className="flex-1 pl-40 pt-20 ">
        <h1 className="text-2xl font-semibold mb-4 text-white">Login</h1>
        <form onSubmit={submitHandler} className="w-96">
          {/* Email */}
          <div className="my-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* Password */}
          <div className="my-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={isLoading} className="btn">
            {isLoading ? "Signing In..." : "Sign in"}
          </button>
          {isLoading && <Loader />}
        </form>
        <p className="text-white mt-4">
          New Customer?{" "}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : "/register"}
            className="text-[#B39CD0] hover:underline"
          >
            Register
          </Link>
        </p>
      </div>

      {/* Right image */}
      <div className="flex-1 flex items-center justify-center bg-black">
        <img src="/logo.png" alt="Logo" className="max-w-full object-contain" />
      </div>
    </section>
  );
};

export default Login;
