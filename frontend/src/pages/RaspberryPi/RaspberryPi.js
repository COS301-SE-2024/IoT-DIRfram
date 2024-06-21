import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import './RaspberryPi.css';
import IoT_Device from '../../components/IoT-Device/IoT-Device';

function RaspberryPi() {
  const [deviceData, setDeviceData] = useState(null);

  useEffect(() => {
    // Simulated fetch for demonstration (replace with actual fetch logic)
    const fetchDeviceData = async () => {
      try {
        const response = await fetch('http://raspberrypi-api-url/device-data');
        if (!response.ok) {
          throw new Error('Failed to fetch device data');
        }
        const data = await response.json();
        setDeviceData(data); // Assuming data structure matches what's needed
      } catch (error) {
        console.error('Error fetching device data:', error);
        // Handle error state if needed
      }
    };

    fetchDeviceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only on mount

  return (
    <div className="raspberry-pi">
      <Header />
      <div className="content">
        <h1 className="info-title">Raspberry Pi Information</h1>
        <hr />
        <div className="system-info">
          {/* Display system information */}
          {/* Example: Replace static data with dynamic data */}
          <div className="info-item">
            <h2>CPU Usage</h2>
            <p>{deviceData?.cpuUsage || 'Unavailable'}</p>
          </div>
          <div className="info-item">
            <h2>Memory Usage</h2>
            <p>{deviceData?.memoryUsage || 'Unavailable'}</p>
          </div>
          <div className="info-item">
            <h2>Disk Space</h2>
            <p>Total: {deviceData?.diskSpace?.total || 'Unavailable'}</p>
            <p>Used: {deviceData?.diskSpace?.used || 'Unavailable'}</p>
            <p>Free: {deviceData?.diskSpace?.free || 'Unavailable'}</p>
          </div>
          <div className="info-item">
            <h2>Network Status</h2>
            <p>IP: {deviceData?.network?.ip || 'Unavailable'}</p>
            <p>Status: {deviceData?.network?.status || 'Unavailable'}</p>
          </div>
        </div>
        <div>
          <h1 className="devices-title">IoT Devices</h1>
          <hr />
          <IoT_Device />
        </div>
      </div>
    </div>
  );
}

export default RaspberryPi;