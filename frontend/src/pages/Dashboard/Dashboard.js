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
        <p><small style={{ color: '#B7B5B7'}}><span style={{color: 'white'}}>HINT:</span> Don't forget to consult our guide if you need help or get stuck <span style={{color: 'white'}}>*<span style={{color: '#007BFF'}}>blue icon</span> - bottom right</span></small></p>
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
