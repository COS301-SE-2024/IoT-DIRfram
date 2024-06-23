import React from 'react';
import './Dashboard.css';
import Device from '../../components/Device/Device'; 
import Header from '../../components/Header/Header';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Header />
      <div className="devices-header">
        <h2 className='devices-title'>Devices</h2>
        {/* <Link to="/device-list" className="view-all-button">
          View All
        </Link> */}
      </div>

      <div className="dash-content">
        <hr className="section-break" />
        <div className='devices-list'>
          <Device />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
