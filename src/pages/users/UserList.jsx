import { useState, useEffect } from 'react';
import { getAllUsers } from '../../api/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages] = useState(2);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers(pageNo, pageSize);
        setUsers(Array.isArray(response.data) ? response.data : []);
        //setTotalPages(response.totalPages || 0);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [pageNo, pageSize]);

  const handlePreviousPage = () => {
    setPageNo((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setPageNo((prev) => (prev + 1 <= totalPages ? prev + 1 : prev));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <div className="bg-white shadow-md rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b">User ID</th>
              <th className="px-6 py-3 border-b">Email</th>
              <th className="px-6 py-3 border-b">Mobile</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId}>
                <td className="px-6 py-4 border-b text-center">{user.userId}</td>
                <td className="px-6 py-4 border-b">{user.email}</td>
                <td className="px-6 py-4 border-b">{user.mobileNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination Controls */}
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
              Page {pageNo+1} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={pageNo+1 >= totalPages}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                pageNo+1 >= totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;