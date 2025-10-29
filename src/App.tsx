import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/home';
import Register from './pages/register';
import Login from './pages/login';
import Dashboard from './pages/dashboard/dashboard';
import UsersManagement from './pages/dashboard/admin/users';
import { Toaster } from 'react-hot-toast';
import CategoriesManagement from './pages/dashboard/admin/categories';
import CategoryFeauteres from './pages/dashboard/admin/categoryFeatures';
import AdvertisingManagment from './pages/dashboard/admin/advertisings';
import UserProfilePage from './pages/dashboard/UserProfile/Main';
import { useCallback, useEffect, useState } from 'react';
import AuthAPI, { type User } from './api/auth_api';
import UserAdverising from './components/dashboard/admin/UserDetails/Advertisings';



function App() {

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const isMobile = window.innerWidth < 450;

  const fetchUserData = useCallback(async () => {
    // Check if user is logged in and is admin
    const access_token = localStorage.getItem('access_token');

    if (!access_token) {
      setToken(null);
      setUser(null);
      return;
    }

    try {
      const response = await AuthAPI.getUser(access_token);

      if (response.success && response.user) {
        setUser(response.user);
        setToken(access_token)

      }
    } catch (error) {
      console.error('خطا در دریافت اطلاعات کاربر:', error);
      setToken(null)
      setUser(null)

      console.error(error);

    }
  }, [])

  useEffect(() => {


    fetchUserData();
  }, []);


  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen pr-16 bg-white dark:bg-gray-900" dir="rtl">
        <div className="text-center text-gray-900 dark:text-white">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-teal-400 rounded-full animate-spin"></div>
          <p>در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (

    <Router>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: '',
          duration: 4000,
          style: {
            background: '#374151',
            color: '#fff',
            fontFamily: 'AmirRoox, Tahoma, Arial, sans-serif',
            direction: 'rtl',
            textAlign: 'right',
          },
          success: {
            duration: 3000,
            style: {
              background: '#065f46',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#7f1d1d',
            },
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Home current_user={user} token={token} isMobile={isMobile} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/admin/users" element={<UsersManagement />} />
        <Route path="/dashboard/admin/categories" element={<CategoriesManagement />} />
        <Route path="/dashboard/admin/category-features" element={<CategoryFeauteres />} />
        <Route path='/dashboard/admin/advertisings' element={<AdvertisingManagment />} />
        <Route path='/dashboard/account' element={<UserProfilePage />} />
        <Route path='/dashboard/advertisings' element={<UserAdverising token={token} currentUser={user} />}></Route>
      </Routes>
    </Router>
  );
}

export default App;