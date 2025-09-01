import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const AdminProductUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: productData } = useGetProductByIdQuery(id);
  const { data: categories = [] } = useFetchCategoriesQuery();

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
    <div className="container xl:mx-[9rem] sm:mx-0">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-6">
          <h2 className="text-xl font-bold mb-6">Update / Delete Product</h2>

          {/* Image Preview */}
          {image && (
            <div className="mb-4">
              <img
                src={image}
                alt="product"
                className="w-full max-h-72 object-contain rounded-md"
              />
            </div>
          )}

          {/* Upload Image */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Upload Image</label>
            <label className="block w-full border border-white/50 rounded-2xl py-6 text-center cursor-pointer">
              {image ? image.split("/").pop() : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
              />
            </label>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name + Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  className="form-input w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Price</label>
                <input
                  type="number"
                  className="form-input w-full"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Quantity + Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  className="form-input w-full"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1">Count In Stock</label>
                <input
                  type="number"
                  className="form-input w-full"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1">Description</label>
              <textarea
                className="form-input w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-input w-full"
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
            <div className="flex space-x-4">
              <button className="px-4 py-2 mt-5 rounded-lg text-md font-semibold  bg-green-600 mr-6">
                Update
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 mt-5 rounded-lg text-md font-semibold bg-purple-600"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;
