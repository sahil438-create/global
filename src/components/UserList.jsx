// components/UserList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const getLocalUpdates = () => {
  const updates = localStorage.getItem('userUpdates');
  return updates ? JSON.parse(updates) : { updatedUsers: {}, deletedUsers: [] };
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `https://reqres.in/api/users?page=${currentPage}`
        );
        const updates = getLocalUpdates();

        const mergedUsers = res.data.data
          .filter((user) => !updates.deletedUsers.includes(user.id.toString()))
          .map((user) => ({
            ...user,
            ...(updates.updatedUsers[user.id.toString()] || {}),
          }));

        setUsers(mergedUsers);
        setTotalPages(res.data.total_pages);
      } catch (err) {
        setError('Failed to fetch users');
      }
    };
    fetchUsers();
  }, [currentPage, location.state]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      const updates = getLocalUpdates();
      updates.deletedUsers.push(id.toString());
      localStorage.setItem('userUpdates', JSON.stringify(updates));
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>User List</h2>
      {error && <p className='text-red-500 mb-4'>{error}</p>}

      <div className='overflow-x-auto rounded-lg shadow'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Avatar
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                First Name
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Last Name
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Email
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {users.map((user) => (
              <tr key={user.id} className='hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <img
                    src={user.avatar}
                    alt='avatar'
                    className='w-12 h-12 rounded-full object-cover'
                  />
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-gray-900'>
                  {user.first_name}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-gray-900'>
                  {user.last_name}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-gray-900'>
                  {user.email}
                </td>
                <td className='px-6 py-4 whitespace-nowrap space-x-2'>
                  <Link
                    to={`/users/${user.id}/edit`}
                    className='text-blue-600 hover:text-blue-900 font-medium'
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className='text-red-600 hover:text-red-900 font-medium'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='mt-6 flex justify-center items-center space-x-4'>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Previous
        </button>
        <span className='text-gray-700'>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList;
