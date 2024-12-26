import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { createProduct, updateProduct, getAllCategories } from "../../api/api";
import { ImSpinner } from "react-icons/im";

const ProductModal = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    productName: product?.productName || "",
    description: product?.description || "",
    stock: product?.stock || 0,
    price: product?.price || 0,
    discount: product?.discount || 0,
    categoryId: product?.categoryId || "",
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    console.log("Product:", product);

    if (product && product.images) {
      setExistingImages(
        product.images.map((img) => ({
          id: img.imageId,
          url: img.imageUrl,
        }))
      );
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);

    if (!product) {
      setExistingImages([]);
    }
  };


  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productData = new FormData();
      
      Object.keys(formData).forEach((key) => {
        productData.append(key, formData[key]);
      });

      console.log("selectedImages", selectedImages);
      console.log("deletedImageIds", deletedImageIds);
      

      
      selectedImages.forEach((image) => {
        productData.append("images", image);
      });

      if (product) {
        const retainedImageIds = existingImages
          .filter(img => !deletedImageIds.includes(img.id))
          .map(img => img.id);
        
        if (retainedImageIds.length > 0) {
          productData.append("retainedImageIds", JSON.stringify(retainedImageIds));
        }
        
        if (deletedImageIds.length > 0) {
          productData.append("deletedImageIds", JSON.stringify(deletedImageIds));
        }
      }

      if (product) {
       
        await updateProduct(product.productId, productData);
      } else {
        
        await createProduct(productData);
      }
      onSuccess();
    } catch (error) {
      setError("Failed to save product");
      console.error("Error saving product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = (image) => {
    if (image.isExisting) {
      setDeletedImageIds(prev => [...prev, image.id]);
      setExistingImages(prev => prev.filter(img => img.id !== image.id));
    } else {
      const newSelectedImages = [...selectedImages];
      newSelectedImages.splice(image.index, 1);
      setSelectedImages(newSelectedImages);
      
      const newPreviews = [...imagePreviews];
      URL.revokeObjectURL(newPreviews[image.index]);
      newPreviews.splice(image.index, 1);
      setImagePreviews(newPreviews);
    }
  };

  const allImages = selectedImages.length > 0 
    ? imagePreviews.map((preview, index) => ({
        url: preview,
        isExisting: false,
        index
      }))
    : existingImages.map(img => ({
        url: img.url,
        isExisting: true,
        id: img.id
      }));

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white rounded-lg p-5 max-w-2xl w-full mt-8 overflow-y-auto  max-h-[calc(100vh-64px)] no-scrollbar z-20">
        <h2 className="text-2xl font-bold mb-4">
          {product ? "Edit Product" : "Add Product"}
        </h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Product Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              rows="3"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                min="0"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Category</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Product Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full mb-4"
            />

            {/* Image Preview Grid */}
            {allImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mb-4">
                {allImages.map((image, index) => (
                  <div key={image.isExisting ? `existing-${image.id}` : `new-${index}`} className="relative">
                    <img
                      src={image.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(image)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              {loading ? <ImSpinner className="animate-spin" /> : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ProductModal.propTypes = {
  product: PropTypes.shape({
    productId: PropTypes.number,
    productName: PropTypes.string,
    description: PropTypes.string,
    stock: PropTypes.number,
    price: PropTypes.number,
    discount: PropTypes.number,
    categoryId: PropTypes.number,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        imageId: PropTypes.number,
        imageUrl: PropTypes.string,
      })
    ),
  }),
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default ProductModal;
