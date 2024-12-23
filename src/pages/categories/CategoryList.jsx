import { useState, useEffect } from "react";
import { getAllCategories, deleteCategory } from "../../api/api";
import CategoryModal from "./CategoryModal";
import { ImSpinner } from "react-icons/im";
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      // Ensure we're setting an array, even if empty
      setCategories(Array.isArray(response) ? response : response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setSelectedCategory(null);
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(categoryId);
        fetchCategories(); // Refresh the list
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Categories</h2>
        <button
          onClick={handleAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          <div className="flex items-center">
            <span className="mr-1"> Add Category</span>
            <IoIosAddCircleOutline />
          </div>
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b">Category ID</th>
              <th className="px-6 py-3 border-b">Name</th>
              <th className="px-6 py-3 border-b justify-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.categoryId}>
                <td className="px-6 py-4 border-b text-center">
                  {category.categoryId}
                </td>
                <td className="px-6 py-4 border-b">{category.categoryName}</td>
                <td className="px-6 py-4 border-b text-center">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-600 hover:text-blue-800 mr-4"
                  >
                    <div className="flex items-center">
                      <span className=" mr-2">Edit</span>
                      <MdModeEditOutline />
                    </div>
                  </button>
                  <button
                    onClick={() => handleDelete(category.categoryId)}
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
        <CategoryModal
          category={selectedCategory}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchCategories();
          }}
        />
      )}
    </div>
  );
};

export default CategoryList;
