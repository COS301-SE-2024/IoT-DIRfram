import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import Device from '../../components/Device/Device'; 
import Header from '../../components/Header/Header';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Header />
      <div className="content">
        <div className="devices-header">
          <h2 className='devices-title'>Devices</h2>
          <Link to="/device-list" className="view-all-button">
            View All
          </Link>
        </div>
        <hr className="section-break" />
        <div className='devices-list'>
          <Device />
          <Device />
          <Device />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
