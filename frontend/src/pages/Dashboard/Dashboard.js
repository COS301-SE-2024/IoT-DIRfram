import React from 'react';
import './Dashboard.css';
import Device from '../../components/Device/Device'; 
import Header from '../../components/Header/Header';

const Dashboard = () => {
  return (
    <div>
      <Header />
      <div className="content">
        <h2 className='Devices'>Devices</h2>
        <div className='Devices-List'>
          <Device />
          <Device />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
