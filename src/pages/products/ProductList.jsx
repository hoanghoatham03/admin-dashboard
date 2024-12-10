import { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../../api/api';
import ProductModal from './ProductModal';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize] = useState(9);
  const [totalPages, setTotalPages] = useState(10);

  const fetchProducts = async () => {
    try {
      const response = await getProducts(pageNo, pageSize);
      setProducts(Array.isArray(response.data) ? response.data : []);
      setTotalPages(response.totalPages || 10);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [pageNo, pageSize]);

  const handleAdd = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handlePreviousPage = () => {
    setPageNo((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setPageNo((prev) => (prev + 1 < totalPages ? prev + 1 : prev));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Products</h2>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add Product
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.productId} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.productName}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.productName}</h3>
              <p className="text-gray-600 text-sm mb-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-800 font-bold">${product.price}</p>
                  <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.productId)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchProducts();
          }}
        />
      )}
      <div className="px-6 py-4 flex items-center justify-between border-t">
        <div className="flex-1 flex justify-between items-center">
          <button
            onClick={handlePreviousPage}
            disabled={pageNo === 0}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              pageNo === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {pageNo + 1} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={pageNo + 1 >= totalPages}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              pageNo + 1 >= totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
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