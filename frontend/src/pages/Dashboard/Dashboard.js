import React, { useState } from 'react';
import './Dashboard.css';
import Device from '../../components/Device/Device';
import Header from '../../components/Header/Header';
import Modal from './Modal';

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);

  const handleAddClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveDevice = (deviceName) => {
    console.log('Device added:', deviceName);
    // Handle the logic to add the device (e.g., update state, make API call, etc.)
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="devices-header">
        <h2 className='devices-title'>Devices</h2>
        <div className='info'>
          <p>
            <small style={{ color: '#B7B5B7'}}><span style={{color: 'white'}}>HINT:</span> Don't forget to consult our guide if you need help or get stuck <span style={{color: 'white'}}>*<span style={{color: '#007BFF'}}>blue icon</span> - bottom right</span></small>
          </p>
          <button className="addButton" onClick={handleAddClick}>Add device</button>
        </div>
      </div>

      <div className="dash-content">
        <hr className="section-break" />
        <div className='devices-list'>
          <Device />
        </div>
      </div>

      <Modal show={showModal} handleClose={handleCloseModal} handleSave={handleSaveDevice} />
    </div>
  );
}

export default Dashboard;
