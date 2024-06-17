import React from 'react';
import './Device.css'; // Create this file for styling
import mock from '../Device/IoT-devices.png'; // Create this file for image

const Device = () => {
  return (
    <div className="device">
      <div className="device-container">
        <img src={mock} alt="Device" className="device-image" />
        <div className="device-info">
          <h2>IoT Device</h2>
          <p><strong>Device ID:</strong> ABC123</p>
          <p><strong>Status:</strong> Online</p>
          <p><strong>Temperature:</strong> 25°C</p>
          <p><strong>Location:</strong> Living Room</p>
        </div>
      </div>
    </div>
  );
};

export default Device;