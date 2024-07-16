import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../slices/authSlice';
import './style/TopNavbar.css';

const TopNavbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="top-navbar">
      <div className="top-navbar-content">
        <div className="top-navbar-left">
          <h2>Hello {user.firstName} {user.lastName} 👋</h2>
          <p>Good Morning</p>
        </div>
        <div className="top-navbar-right">
          <div className="search-bar">
            <input type="text" placeholder="Search" />
            <button className="notification-button">🔔</button>
          </div>
          <div className="user-info">
            <img src={user.profilePicture} alt="Profile" className="profile-picture" />
            <span>{user.firstName} {user.lastName}</span>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
