import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Assuming you're using Font Awesome icons
import { faHome, faUser, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
import Cookies from 'js-cookie'; // Ensure you have js-cookie installed
import './Sidebar.css';

const Sidebar = ({ isOpen, handleToggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('session');
    navigate('/splash'); 
  };

  return (
    <div className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <nav>
        <ul>
          <li>
            <Link to="/" onClick={handleToggleSidebar}>
              <FontAwesomeIcon icon={faHome} /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/profile" onClick={handleToggleSidebar}>
              <FontAwesomeIcon icon={faUser} /> Profile
            </Link>
          </li>
          <li>
            <Link to="/settings" onClick={handleToggleSidebar}>
              <FontAwesomeIcon icon={faCog} /> Settings
            </Link>
          </li>
        </ul>
        <div className="logout-btn" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;