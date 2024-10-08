import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../../assets/code-crafters-logo.png";
import Sidebar from '../Sidebar/Sidebar';
import './Header.css';
import BackButton from '../BackButton/BackButton';
import ForwardButton from '../ForwardButton/ForwardButton';

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      <header className="header">
        <div className="RHSHeader">
          <div className={`menu-btn ${sidebarOpen ? 'open' : ''}`} onClick={handleToggleSidebar}>
             <div className="menu-icon"><div className='menu-menu'><u>Menu</u></div></div>
          </div>
          <div className="about">
            <Link to="/about">
              <img src={logo} alt="Code_Crafters_logo" className="logo"/>
            </Link>
          </div>
        </div>

        <div className="title">
          <Link to="/dashboard">
            <h1>IoT-DIRfram</h1>
          </Link>
        </div>

        {/* <div>
        <Link to="/postslist">
          <button className="edit-button-device">Posts</button>
        </Link>
        </div> */}
        <div>
          <BackButton />
          <ForwardButton />
        </div>
      </header>
      <Sidebar isOpen={sidebarOpen} handleToggleSidebar={handleToggleSidebar} />
    </div>
  );
};

export default Header;