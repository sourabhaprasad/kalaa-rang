import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useGetCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const AdminProductUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: productData } = useGetProductByIdQuery(id);
  const { data: categories = [] } = useGetCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    if (productData) {
      setImage(productData.image ?? "");
      setName(productData.name ?? "");
      setDescription(productData.description ?? "");
      setPrice(productData.price ?? "");
      setCategory(productData.category?._id ?? productData.category ?? "");
      setQuantity(productData.quantity ?? "");
      setStock(productData.countInStock ?? "");
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      setImage(res.image);
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("countInStock", stock);
      formData.append("image", image);

      const res = await updateProduct({ productId: id, formData }).unwrap();

      toast.success(`Product "${res.name}" updated successfully`);

      navigate("/admin/allproductslist");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Product update failed. Try again.");
    }
  };

  const handleDelete = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this product?"))
        return;

      const { data } = await deleteProduct(id);
      toast.success(`"${data.name}" deleted successfully`);
      navigate("/admin/allproductslist");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black p-6 pt-20">
      <div className="max-w-7xl mx-auto">
        <AdminMenu />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Update / Delete Product</h1>
          <p className="text-gray-400">Modify product details or remove from catalog</p>
        </div>
        
        <div className="bg-black rounded-lg border border-gray-700 shadow-xl p-6">

          {/* Image Preview */}
          {image && (
            <div className="mb-6">
              <img
                src={image}
                alt="product"
                className="w-full max-h-72 object-contain rounded-lg bg-gray-800"
              />
            </div>
          )}

          {/* Upload Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-200 mb-2">Upload Image</label>
            <label className="block w-full border border-white/50 rounded-2xl py-6 text-center cursor-pointer">
              {image ? image.split("/").pop() : "Upload Image"}
              <input
                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all"
                onChange={uploadFileHandler}
              />
            </label>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name + Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="price" className="block text-sm font-medium text-gray-200 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Quantity + Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-6">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-200 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="stock" className="block text-sm font-medium text-gray-200 mb-2">
                  Count In Stock
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-2">
                Description
              </label>
              <textarea
                rows="4"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all"
              >
                <option value="">Select category</option>
                {categories?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 px-8 py-4 bg-white text-black font-bold rounded-lg transition-colors hover:bg-gray-100"
              >
                Update Product
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 px-8 py-4 bg-gray-800 text-white font-bold rounded-lg border border-gray-700 transition-colors hover:bg-gray-700"
              >
                Delete Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;
