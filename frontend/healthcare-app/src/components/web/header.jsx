import React, { useState, useEffect, use } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, Search, LogOut, InspectionPanelIcon } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // TODO: Get from auth context
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // TODO: Get from auth context
  useEffect(() => {
    checkAuthStatus();
  }, []);
  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try{
        const user = JSON.parse(userData);
        setIsLoggedIn(true);
        setUserInfo(user);
      } catch(err){
        console.error("Error parsing user data from localStorage", err);
        clearAuthData();
      }
    }
    else {
      setIsLoggedIn(false);
      setUserInfo(null);
    }
  };
  const handleLogout = () => {
    clearAuthData();
    setIsLoggedIn(false);
    setUserInfo(null);
    setShowUserMenu(false);
    navigate('/home');
  };
const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

return (
    <header className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg fixed w-full z-10">
      <div className="container mx-auto px-4">
        {/* Top Bar - User Info */}
        {isLoggedIn && (
        <div className="flex justify-end items-center py-2">
          <div className="flex items-center gap-4">
            <button className="text-white hover:text-gray-200 transition-colors">
              <Bell size={20} />
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
              >
                <User size={20} />
                <span className="text-sm">{userInfo?.username || userInfo?.email || 'User'}</span>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Thông tin cá nhân
                  </Link>
                  <Link 
                    to="/profile/history" 
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Lịch sử khám
                  </Link>
                  <button 
                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        )}
        {/* Main Navigation */}
        <nav className="bg-white rounded-full px-8 py-4 mb-6 shadow-md">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-blue-600">
              HealthCareVippro
            </Link>

            {/* Menu Items */}
            <div className="hidden md:flex items-center gap-8">
              <Link 
                to="/home" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                About us
              </Link>
              <Link 
                to="/doctors" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Bác sĩ
              </Link>
              <Link 
                to="/specialties" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Chuyên khoa
              </Link>
            </div>

            {/* Auth Buttons */}
            {!isLoggedIn && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-all"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all"
              >
                Sign up
              </button>
            </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;