// src/components/dashboard/Navbar.js
import React, { useState } from 'react';
import './styles/navbar.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaPaw, FaUserCircle, FaSignOutAlt, FaCog } from 'react-icons/fa';

const Navbar = ({ className }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className={`navBar ${className}`}>
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center">
          <FaPaw className="text-white text-4xl" />
        </div>
        
        <h1 className="text-white text-2xl font-bold absolute left-1/2 transform -translate-x-1/2">
          Dairy Farm Management System
        </h1>
        
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
          >
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
            ) : (
              <FaUserCircle className="text-white text-3xl" />
            )}
            <span className="text-white font-medium">{user.email}</span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50 profile-dropdown">
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <FaCog className="mr-2" />
                Profile Settings
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
