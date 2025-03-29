// components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://reqres.in/api/login', {
        email,
        password,
      });
      localStorage.setItem('token', res.data.token);
      navigate('/users');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
          Login
        </h2>
        {error && <p className='text-red-500 mb-4 text-center'>{error}</p>}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-gray-700 mb-2'>Email:</label>
            <input
              type='email'
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
              required
            />
          </div>
          <div>
            <label className='block text-gray-700 mb-2'>Password:</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
              required
            />
          </div>
          <button
            type='submit'
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors'
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
