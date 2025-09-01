import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { Link } from "react-router";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.username);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 mt-24">
      <div className="flex justify-center items-center">
        <div className="w-full max-w-md p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Update Profile
          </h2>
          <form onSubmit={submitHandler}>
            {/* Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-white mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-white mb-2">
                Email
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
            <div className="mb-4">
              <label htmlFor="password" className="block text-white mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-white mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="form-input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-between">
              <button
                type="submit"
                className="btn"
                disabled={loadingUpdateProfile}
              >
                {loadingUpdateProfile ? <Loader /> : "Update Profile"}
              </button>
              <Link to="/users-order" className="btn">
                My Orders
              </Link>
            </div>
          </form>
        </div>
        {loadingUpdateProfile && <Loader />}
      </div>
    </div>
  );
};

export default Profile;
