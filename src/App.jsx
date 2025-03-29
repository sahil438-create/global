// App.js
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './components/Login';
import UserList from './components/UserList';
import EditUser from './components/EditUser';

function App() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location = '/login';
  };

  return (
    <BrowserRouter>
      <nav className='bg-blue-600 p-4 text-white'>
        <div className='container mx-auto flex justify-between items-center'>
          <Link to='/users' className='text-xl font-bold'>
            EmployWise
          </Link>
          <button
            onClick={handleLogout}
            className='bg-red-500 hover:bg-red-600 px-4 py-2 rounded'
          >
            Logout
          </button>
        </div>
      </nav>

      <Routes>
        <Route path='/login' element={<Login />} />
        <Route
          path='/users'
          element={
            <PrivateRoute>
              <UserList />
            </PrivateRoute>
          }
        />
        <Route
          path='/users/:id/edit'
          element={
            <PrivateRoute>
              <EditUser />
            </PrivateRoute>
          }
        />
        <Route path='*' element={<Navigate to='/login' />} />
      </Routes>
    </BrowserRouter>
  );
}

const PrivateRoute = ({ children }) => {
  const tokenn = localStorage.getItem('tokenn');
  return tokenn ? children : <Navigate to='/login' />;
};

export default App;
