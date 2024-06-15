import React, { useState } from 'react';
import './Dashboard.css';
import logo from "./code-crafters-logo.png";
import Device from '../../components/Device/Device'; 
import Sidebar from '../../components/Sidebar/Sidebar';

// Header Component
const Header = ({ onLogout, onToggleSidebar, sidebarOpen }) => (
  <header className="header">
    <div className="RHSHeader">
      <div className={`menu-btn ${sidebarOpen ? 'open' : ''}`} onClick={onToggleSidebar}>
        <div className="menu-icon"></div>
      </div>
      <div className="about">
        <img src={logo} alt="Code_Crafters_logo" className="logo"/>
      </div>
    </div>
    <h1>IoT-DIRfram</h1>
    <div className="logout-btn" onClick={onLogout}>
      Logout
    </div>
  </header>
);

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    // Handle logout logic here
    alert('Logged out!'); // For demonstration
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      <Header onLogout={handleLogout} onToggleSidebar={handleToggleSidebar} sidebarOpen={sidebarOpen} />
      <Sidebar />
      <h2 className='Devices'>Devices</h2>
      <div className='Devices-List'>
        <Device />
        <Device />
      </div>
    </div>
  );
}

export default Dashboard;
