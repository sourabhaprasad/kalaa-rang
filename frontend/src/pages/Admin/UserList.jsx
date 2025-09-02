import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id, username) => {
    toast(
      <div className="flex flex-col">
        <span>
          Are you sure you want to delete <strong>{username}</strong>?
        </span>
        <div className="mt-2 flex justify-end gap-2">
          <button
            className="bg-red-500 text-white py-1 px-2 rounded"
            onClick={async () => {
              try {
                await deleteUser(id).unwrap();
                toast.success("User deleted successfully!");
                refetch();
              } catch (err) {
                toast.error(
                  err?.data?.message || err.message || "Delete failed"
                );
              }
            }}
          >
            Yes
          </button>
          <button
            className="bg-gray-500 text-white py-1 px-2 rounded"
            onClick={() => toast.dismiss()}
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  const toggleEdit = (user) => {
    setEditableUserId(user._id);
    setEditableUserName(user.username);
    setEditableUserEmail(user.email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const renderFieldValue = (user, field) => {
    if (field === "username") return user.username;
    if (field === "email") {
      return (
        <span
          className="text-blue-600 underline cursor-pointer"
          onClick={() => (window.location.href = `mailto:${user.email}`)}
        >
          {user.email}
        </span>
      );
    }
    return null;
  };

  const renderUserField = (user, field) => {
    const isEditing = editableUserId === user._id;

    if (isEditing) {
      const value = field === "username" ? editableUserName : editableUserEmail;
      const onChange =
        field === "username"
          ? (e) => setEditableUserName(e.target.value)
          : (e) => setEditableUserEmail(e.target.value);

      return (
        <div className="flex items-center">
          <input
            type="text"
            value={value}
            onChange={onChange}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all"
          />
          <button
            onClick={() => updateHandler(user._id)}
            className="ml-2 bg-white hover:bg-gray-100 text-black py-2 px-4 rounded-lg transition"
          >
            <FaCheck />
          </button>
        </div>
      );
    }

    const displayValue = renderFieldValue(user, field);

    return (
      <div className="flex items-center text-gray-300">
        {displayValue}
        <button
          onClick={() => toggleEdit(user)}
          className="ml-3 text-gray-400 hover:text-gray-200"
        >
          <FaEdit />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black p-6 pt-20 relative overflow-hidden">

      <div className="relative z-10 max-w-7xl mx-auto">
        <AdminMenu />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            User Management
          </h1>
          <p className="text-gray-400">Manage user accounts and permissions</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <Loader />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-32">
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          </div>
        ) : (
          <div className="bg-black rounded-lg border border-gray-700 shadow-xl overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                  <div className="p-2 bg-gray-700 rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  All Users
                </h2>
                <span className="text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded-full">
                  {users?.length || 0} users
                </span>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">User ID</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Admin</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="group hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 transition-all duration-300"
                    >
                      <td className="px-6 py-4">
                        <span className="text-gray-400 font-mono text-sm bg-gray-800/50 px-2 py-1 rounded">
                          {user._id.slice(-8)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {renderUserField(user, "username")}
                      </td>
                      <td className="px-6 py-4">
                        {renderUserField(user, "email")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {user.isAdmin ? (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-green-400 font-medium">Admin</span>
                              <FaCheck className="text-green-400 ml-1" size={14} />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              <span className="text-gray-400 font-medium">User</span>
                              <FaTimes className="text-gray-400 ml-1" size={14} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {!user.isAdmin && (
                          <button
                            onClick={() => deleteHandler(user._id, user.username)}
                            className="group/btn relative p-2 bg-gradient-to-r from-red-500/20 to-rose-600/20 text-red-400 rounded-xl border border-red-500/30 hover:from-red-500 hover:to-rose-600 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/25"
                          >
                            <FaTrash size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
