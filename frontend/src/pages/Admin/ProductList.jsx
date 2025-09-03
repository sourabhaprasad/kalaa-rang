import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useGetCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);

  const navigate = useNavigate();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useGetCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!image) {
      toast.error("Please upload an image");
      return;
    }
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!price || price <= 0) {
      toast.error("Valid price is required");
      return;
    }
    if (!category) {
      toast.error("Category is required");
      return;
    }
    if (!quantity || quantity <= 0) {
      toast.error("Valid quantity is required");
      return;
    }
    if (!stock || stock < 0) {
      toast.error("Valid stock count is required");
      return;
    }

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product create failed. Try Again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try Again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);

      setImageUrl(res.image);
      setImage(res.image); // Store the image URL/path, not the filename
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="min-h-screen bg-black p-6 pt-20 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        <AdminMenu />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create Product</h1>
          <p className="text-gray-400">Add a new product to your catalog</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Image Upload Section */}
          <div className="bg-black rounded-lg border border-gray-700 shadow-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-gray-800 rounded-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              Product Image
            </h2>

            {/* Image Preview */}
            {imageUrl && (
              <div className="mb-6">
                <img
                  src={imageUrl}
                  alt="product preview"
                  className="w-full max-h-[300px] object-contain rounded-2xl bg-gray-800/50"
                />
              </div>
            )}

            {/* Upload Button */}
            <label className="group relative block w-full p-8 border-2 border-dashed border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer flex flex-col items-center justify-center">
              <div className="text-center">
                <svg
                  className="w-12 h-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-gray-400 text-center">
                  {image
                    ? "Image uploaded successfully"
                    : "Click to upload image"}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
              />
            </label>
          </div>

          {/* Product Details Form */}
          <div className="bg-black rounded-lg border border-gray-700 shadow-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-gray-800 rounded-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              Product Details
            </h2>

            <div className="space-y-6">
              {/* Name + Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 bg-gradient-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-sm rounded-2xl border border-gray-600/50 text-white placeholder-gray-400 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/20 transition-all duration-300"
                    placeholder="Enter product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    className="w-full p-4 bg-gradient-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-sm rounded-2xl border border-gray-600/50 text-white placeholder-gray-400 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/20 transition-all duration-300"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Quantity + Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  className="w-full p-4 bg-gradient-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-sm rounded-2xl border border-gray-600/50 text-white placeholder-gray-400 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/20 transition-all duration-300"
                  placeholder="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Stock Count
                </label>
                <input
                  type="number"
                  className="w-full p-4 bg-gradient-to-br from-gray-800/80 to-gray-700/80 backdrop-blur-sm rounded-2xl border border-gray-600/50 text-white placeholder-gray-400 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/20 transition-all duration-300"
                  placeholder="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Category
              </label>
              <select
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Description
              </label>
              <textarea
                rows="4"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all resize-none"
                placeholder="Enter product description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full px-8 py-4 bg-white text-black font-bold rounded-lg transition-colors mt-5 hover:bg-gray-100 disabled:opacity-50"
            >
              <span className="relative z-10">Create Product</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
