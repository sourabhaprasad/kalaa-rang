import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
  const { data: categories } = useGetCategoriesQuery();
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
    <div className="min-h-screen bg-black p-6 pt-20 relative overflow-hidden">

      <div className="relative z-10 max-w-7xl mx-auto">
        <AdminMenu />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Category Management
          </h1>
          <p className="text-gray-400">Create and manage product categories</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Create Category Section */}
          <div className="xl:col-span-1">
            <div className="bg-black rounded-lg border border-gray-700 shadow-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                Create New Category
              </h2>
              
              <CategoryForm
                value={name}
                setValue={setName}
                handleSubmit={handleCreateCategory}
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="xl:col-span-2">
            <div className="bg-black rounded-lg border border-gray-700 shadow-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-gray-800 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                Existing Categories
                <span className="ml-auto text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                  {categories?.length || 0} categories
                </span>
              </h2>

              {categories?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <button
                      key={category._id}
                      className="bg-black rounded-lg border border-gray-700 p-4 transition-colors hover:bg-gray-800 cursor-pointer"
                      onClick={() => {
                        setSelectedCategory(category);
                        setUpdatingName(category.name);
                        setModalVisible(true);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.name}</span>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-pink-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-700/50 to-gray-600/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-lg">No categories created yet</p>
                  <p className="text-gray-500 text-sm mt-2">Create your first category to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal for Update/Delete */}
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <div className="bg-gradient-to-br from-gray-900/95 via-slate-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-xl">
                <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              Edit Category
            </h2>
            
            <form onSubmit={handleUpdateCategory} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={updatingName}
                  onChange={(e) => setUpdatingName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all"
                  placeholder="Enter category name"
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg transition-colors hover:bg-gray-700 disabled:opacity-50"
                >
                  <span className="relative z-10">Update Category</span>
                </button>
                
                <button
                  type="button"
                  onClick={handleDeleteCategory}
                  className="w-full px-6 py-3 bg-white text-black font-semibold rounded-lg transition-colors hover:bg-gray-100 disabled:opacity-50"
                >
                  <span className="relative z-10">Delete Category</span>
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CategoryList;
