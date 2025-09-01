import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
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
  const { data: categories } = useFetchCategoriesQuery();

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
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <div className="h-12 font-bold text-lg">Create Product</div>

          {/* Image Preview */}
          {imageUrl && (
            <div className="mb-4">
              <img
                src={imageUrl}
                alt="product"
                className="w-full max-h-[300px] object-contain"
              />
            </div>
          )}

          <label className="border border-white/20 text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
            {image || "Upload Image"}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={uploadFileHandler}
              className="hidden"
            />
          </label>

          <div className="p-3">
            {/* Name + Price */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  className="form-input"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Quantity + Stock */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  className="form-input"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="stock">Count In Stock</label>
                <input
                  type="number"
                  className="form-input"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description">Description</label>
              <textarea
                className="p-2 bg-[#101011] border border-white/20 rounded-lg w-full text-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            {/* Category */}
            <div className="mb-4">
              <label htmlFor="category">Category</label>
              <select
                className="form-input w-full"
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

            {/* Submit */}
            <button onClick={handleSubmit} className="btn w-full mt-3">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
