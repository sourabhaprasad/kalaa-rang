import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  // Create category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Category name is required.");
      return;
    }
    try {
      const res = await createCategory({ name }).unwrap();
      if (res.error) {
        toast.error(res.error);
      } else {
        setName("");
        toast.success(`${res.name} is created!`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, try again.");
    }
  };

  // Update category
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!updatingName) {
      toast.error("Category name is required.");
      return;
    }
    try {
      const res = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: { name: updatingName },
      }).unwrap();

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`${res.name} is updated successfully.`);
      }

      setUpdatingName("");
      setModalVisible(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error(error);
      toast.error("Updating category failed, try again.");
    }
  };

  // Delete category
  const handleDeleteCategory = async () => {
    if (!selectedCategory?._id) {
      toast.error("No category selected!");
      return;
    }
    try {
      const res = await deleteCategory(selectedCategory._id).unwrap();
      toast.success(`${res.name} is deleted.`);
      setSelectedCategory(null);
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      toast.error("Category deletion failed, try again.");
    }
  };

  return (
    <div className="ml-[10rem] flex flex-col md:flex-row ">
      <div className="md-w-3/4 p-3">
        <div className="h-12 font-semibold text-lg">Manage Categories</div>

        {/* Create new category */}
        <CategoryForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateCategory}
        />

        <br />

        {/* Existing categories */}
        <div className="flex flex-wrap">
          {categories?.length ? (
            categories.map((category) => (
              <div key={category._id}>
                <button
                  className="border border-purple-300 text-purple-300 py-2 px-2 rounded-lg m-1 
             hover:bg-purple-200 hover:text-purple-900 
             focus:outline-none focus:ring-2 focus:ring-purple-200 focus:ring-opacity-50"
                  onClick={() => {
                    setSelectedCategory(category); // ✅ keep category reference
                    setUpdatingName(category.name);
                    setModalVisible(true);
                  }}
                >
                  {category.name}
                </button>
              </div>
            ))
          ) : (
            <p>No categories yet</p>
          )}
        </div>

        {/* Modal for Update/Delete */}
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <form onSubmit={handleUpdateCategory} className="flex flex-col gap-3">
            <h1 className="font-semibold">Update or Delete</h1>
            <input
              type="text"
              value={updatingName}
              onChange={(e) => setUpdatingName(e.target.value)}
              className="border border-white/50 px-2 py-1 rounded"
              placeholder="Update category name"
            />
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-purple-200 text-purple-900 px-4 py-2 rounded hover:bg-purple-300"
              >
                Update
              </button>
              <button
                type="button"
                onClick={handleDeleteCategory}
                className="bg-red-200 text-red-900 px-4 py-2 rounded hover:bg-red-300"
              >
                Delete
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default CategoryList;
