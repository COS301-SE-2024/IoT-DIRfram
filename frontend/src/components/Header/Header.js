import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import logo from "../../assets/code-crafters-logo.png";
import Sidebar from '../Sidebar/Sidebar';
import './Header.css';

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('session');
    navigate('/splash'); 
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
