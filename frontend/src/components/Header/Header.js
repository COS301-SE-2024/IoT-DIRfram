// Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../../assets/code-crafters-logo.png";
import Sidebar from '../Sidebar/Sidebar';
import './Header.css';

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    alert('Logged out!'); 
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      <header className="header">
        <div className="RHSHeader">
          <div className={`menu-btn ${sidebarOpen ? 'open' : ''}`} onClick={handleToggleSidebar}>
            <div className="menu-icon"></div>
          </div>
          <div className="about">
            <Link to="/about">
              <img src={logo} alt="Code_Crafters_logo" className="logo"/>
            </Link>
          </div>
        </div>
        <h1>IoT-DIRfram</h1>
        <div className="logout-btn" onClick={handleLogout}>
          Logout
        </div>
      </header>
      <Sidebar isOpen={sidebarOpen} handleToggleSidebar={handleToggleSidebar} />
    </div>
  );
};

export default Header;