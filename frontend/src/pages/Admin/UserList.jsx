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
    if (field === "email")
      return <a href={`mailto:${user.email}`}>{user.email}</a>;
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
            className="w-full p-2 border border-gray-600 rounded-lg bg-transparent text-gray-300"
          />
          <button
            onClick={() => updateHandler(user._id)}
            className="ml-2 bg-blue-600 hover:bg-blue-700 text-gray-100 py-2 px-4 rounded-lg transition"
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
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 text-gray-200 text-center md:text-left ml-[10rem]">
        Users
      </h1>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full md:w-4/5 mx-auto text-gray-300 border border-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">NAME</th>
                <th className="px-4 py-2 text-left">EMAIL</th>
                <th className="px-4 py-2 text-left">ADMIN</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-700 hover:bg-gray-900"
                >
                  <td className="px-4 py-2 text-gray-400">{user._id}</td>
                  <td className="px-4 py-2">
                    {renderUserField(user, "username")}
                  </td>
                  <td className="px-4 py-2">
                    {renderUserField(user, "email")}
                  </td>
                  <td className="px-4 py-2">
                    {user.isAdmin ? (
                      <FaCheck className="text-green-400" />
                    ) : (
                      <FaTimes className="text-red-400" />
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {!user.isAdmin && (
                      <button
                        onClick={() => deleteHandler(user._id)}
                        className="bg-red-400 hover:bg-red-500 text-gray-100 font-bold py-2 px-4 rounded transition"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;
