import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import './Device-list.css';
import Device from '../../components/Device/Device'; 

function Devices() {
  // State to hold the list of devices
  const [devices, setDevices] = useState([]);

  // Simulating fetching devices (use useEffect for real data fetching)
  useEffect(() => {
    // Here you would fetch the data from an API or other source
    const fetchedDevices = []; // Replace with actual data fetching logic
    setDevices(fetchedDevices);
  }, []);

  return (
    <div className="device-list">
      <Header />
      <div className="content">
        <h1 className="devices-title">Connected Devices</h1>
        <div className="devices-list">
          {/* {devices.length === 0 ? (
            <p>No devices connected.</p>
          ) : (
            devices.map((device, index) => (
              <div key={index} className="device-item">
                <h2>{device.name}</h2>
                <p>{device.description}</p>
              </div>
            ))
          )} */}

          <Device />
        </div>
      </div>
    </div>
  );
}

export default Devices;
