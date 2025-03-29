// components/EditUser.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`https://reqres.in/api/users/${id}`);
        const updates = JSON.parse(localStorage.getItem('userUpdates') || '{}');
        setFormData({
          ...res.data.data,
          ...(updates.updatedUsers?.[id] || {}),
        });
      } catch (err) {
        setError('Failed to fetch user data');
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updates = JSON.parse(localStorage.getItem('userUpdates') || '{}');
      updates.updatedUsers = {
        ...updates.updatedUsers,
        [id]: formData,
      };
      localStorage.setItem('userUpdates', JSON.stringify(updates));

      await axios.put(`https://reqres.in/api/users/${id}`, {
        name: `${formData.first_name} ${formData.last_name}`,
        job: formData.email,
      });

      navigate('/users', {
        state: {
          updatedUser: { id: Number(id), ...formData },
        },
      });
    } catch (err) {
      setError('Failed to update user');
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
          Edit User
        </h2>
        {error && <p className='text-red-500 mb-4 text-center'>{error}</p>}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-gray-700 mb-2'>First Name:</label>
            <input
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
              className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
              required
            />
          </div>
          <div>
            <label className='block text-gray-700 mb-2'>Last Name:</label>
            <input
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
              className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
              required
            />
          </div>
          <div>
            <label className='block text-gray-700 mb-2'>Email:</label>
            <input
              type='email'
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
              required
            />
          </div>
          <button
            type='submit'
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors'
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
