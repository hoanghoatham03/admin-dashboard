import { useState, useEffect } from "react";
import { getProducts, deleteProduct, getProductById } from "../../api/api";
import ProductModal from "./ProductModal";
import { ImSpinner } from "react-icons/im";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(10);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const fetchProducts = async () => {
    try {
      const response = await getProducts(pageNo, pageSize);

      setProducts(
        Array.isArray(response.data.products) ? response.data.products : []
      );
      setTotalPages(response.data.totalPages || 10);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductbyId = async (productId) => {
    try {
      const response = await getProductById(productId);
      setSelectedProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
      setSelectedProduct(null);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [pageNo, pageSize]);

  const handleAdd = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleEdit = async (productId) => {
    await fetchProductbyId(productId);
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handlePreviousPage = () => {
    setPageNo((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setPageNo((prev) => (prev + 1 < totalPages ? prev + 1 : prev));
  };

  const trimDescription = (text, maxLength = 50) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleSuccess = () => {
    setShowModal(false);
    showToast(
      selectedProduct
        ? "Product updated successfully!"
        : "Product added successfully!"
    );
    fetchProducts();
  };

  if (loading)
    return (
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <ImSpinner className="animate-spin h-12 w-12 text-blue-600" />
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4">
      {toast.show && (
        <div className="fixed top-20 right-[calc(42vw)] z-50">
          <div
            className={`rounded-lg px-4 py-3 shadow-lg ${
              toast.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Products</h2>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          <div className="flex items-center">
            <span className="mr-1">Add Product</span>
            <IoIosAddCircleOutline />
          </div>
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase text-center">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase text-center">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.productId}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={product.imageUrl}
                    alt={product.productName}
                    className="h-12 w-12 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.productName}
                </td>
                <td className="px-6 py-4">
                  {trimDescription(product.description)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => handleEdit(product.productId)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    <div className="flex items-center">
                      <span className=" mr-2">Edit</span>
                      <MdModeEditOutline />
                    </div>
                  </button>
                  <button
                    onClick={() => handleDelete(product.productId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <div className="flex items-center">
                      <span className="mr-1">Delete</span>
                      <MdDelete />
                    </div>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
      <div className="px-6 py-4 flex items-center justify-between border-t">
        <div className="flex-1 flex justify-between items-center">
          <button
            onClick={handlePreviousPage}
            disabled={pageNo === 0 || showModal}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              pageNo === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Previous
          </button>
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setPageNo(index)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  pageNo === index
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            onClick={handleNextPage}
            disabled={pageNo + 1 >= totalPages || showModal}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              pageNo + 1 >= totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
