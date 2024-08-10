import React, { useState } from 'react';
import './Dashboard.css';
import Device from '../../components/Device/Device';
import Header from '../../components/Header/Header';
import Modal from './Modal';
import Cookies from 'js-cookie';


const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);

  const handleAddClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveDevice = async (deviceId) => {
    const username = Cookies.get("username"); // Get the username from cookies
  
    const body = JSON.stringify({ device_id: deviceId, username });
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/device/addDeviceToUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });
  
      if (!response.ok) {
        throw new Error('Failed to add device');
      }
  
      const data = await response.json();
      console.log(data.message); // Log success message
      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error('Error adding device:', error);
      // Reload the page to reflect changes
      window.location.reload();
    }
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
