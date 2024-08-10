import React from 'react';
import Header from '../../components/Header/Header';
import IoT_Device from '../../components/IOT_DEVICE/IOT_DEVICE';
import './RaspberryPi.css';
import Cookies from 'js-cookie'; // Make sure to import this

function RaspberryPi() {
  const deviceId = Cookies.get('deviceId') || ''; // Retrieve deviceId from cookies
  console.log('deviceId:', deviceId); // This will log the deviceId retrieved from cookies

  return (
    <div className="raspberry-pi">
      <Header />
      <div className="iot-content">
        <h1 className="devices-title">IoT Devices</h1>
        <p><small style={{ color: '#B7B5B7'}}><span style={{color: 'white'}}>HINT:</span> Don't forget to consult our guide if you need help or get stuck <span style={{color: 'white'}}>*<span style={{color: '#007BFF'}}>blue icon</span> - bottom right</span></small></p>
        <hr />
        {/* Pass the deviceId to IoT_Device */}
        <IoT_Device deviceId={deviceId} />
      </div>
    </div>
  );
}

export default RaspberryPi;

