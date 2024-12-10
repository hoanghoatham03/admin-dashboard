import { useState } from 'react';
import PropTypes from 'prop-types';
import { createCategory, updateCategory } from '../../api/api';

const CategoryModal = ({ category, onClose, onSuccess }) => {
  const [categoryName, setCategoryName] = useState(category?.categoryName || '');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (category) {
        await updateCategory(category.categoryId, { categoryName });
      } else {
        await createCategory({ categoryName });
      }
      onSuccess();
    } catch (error) {
      setError('Failed to save category');
      console.error('Error saving category:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">
          {category ? 'Edit Category' : 'Add Category'}
        </h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Category Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

CategoryModal.propTypes = {
  category: PropTypes.shape({
    categoryId: PropTypes.string,
    categoryName: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default CategoryModal; 