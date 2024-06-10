import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './Dashboard.css';

// Components for pages
const Home = () => (
  <div>
    <h2>Home</h2>
    <p>Welcome to the Home page!</p>
  </div>
);

const Devices = () => (
  <div>
    <h2>Devices</h2>
    <p>Your devices list goes here.</p>
  </div>
);

const Analytics = () => (
  <div>
    <h2>Analytics</h2>
    <p>Your analytics data goes here.</p>
  </div>
);

const Settings = () => (
  <div>
    <h2>Settings</h2>
    <p>Modify your settings here.</p>
  </div>
);

const NotFound = () => (
  <div>
    <h2>404 Not Found</h2>
    <p>Oops! Page not found.</p>
  </div>
);

// Header Component
const Header = ({ onLogout }) => (
  <header className="header">
    <div className="logout-btn" onClick={onLogout}>
      Logout
    </div>
  </header>
);

const Dashboard = () => {
  const handleLogout = () => {
    // Handle logout logic here
    alert('Logged out!'); // For demonstration
  };

  return (
    <div className="dashboard">
      <Header onLogout={handleLogout} />
      <div className="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/devices">Devices</Link></li>
          <li><Link to="/analytics">Analytics</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>
      </div>
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
