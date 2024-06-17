// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, handleToggleSidebar }) => (
  <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
    <nav>
      <ul>
        <li>
          <Link to="/" onClick={handleToggleSidebar}>Dashboard</Link>
        </li>
        <li>
          <Link to="/devices" onClick={handleToggleSidebar}>Devices</Link>
        </li>
        <li>
          <Link to="/raspberry" onClick={handleToggleSidebar}>Raspberry Pi</Link>
        </li>
        <li>
          <Link to="/profile" onClick={handleToggleSidebar}>Profile</Link>
        </li>
        <li>
          <Link to="/settings" onClick={handleToggleSidebar}>Settings</Link>
        </li>
      </ul>
    </nav>
  </div>
);

export default Sidebar;