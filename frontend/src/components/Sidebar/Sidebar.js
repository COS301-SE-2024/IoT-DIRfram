import React from 'react';
import { BrowserRouter as Link } from 'react-router-dom';

const Sidebar = ({ onLogout, onToggleSidebar, sidebarOpen }) => {
    <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <h2>Dashboard</h2>
        <ul>
          <li><Link to="/" >Home</Link></li>
          <li><Link to="/devices" >Devices</Link></li>
          <li><Link to="/analytics" >Analytics</Link></li>
          <li><Link to="/settings" >Settings</Link></li>
        </ul>
      </div>
}

export default Sidebar;