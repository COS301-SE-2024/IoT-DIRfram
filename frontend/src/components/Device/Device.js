import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Device.css'; 
import image from '../../assets/rpi.png'; 

const Device = () => {
  const [devices, setDevices] = useState([]);
  const [username, setUsername] = useState(''); 
  var devicesArray = [];

  useEffect(() => {
    const storedUsername = Cookies.get("username"); 
    setUsername(storedUsername);

    const fetchDevices = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/device/devicesForUser`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ storedUsername }),
        });
        if (!response.ok) {
          throw new Error('Failed to fetch devices');
        }
        const data = await response.json();
        devicesArray = data;
        setDevices(data);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    if (username) {
      fetchDevices();
    }
  }, [username]);

  return (
    <div className="devices-list">
    <p>username: {username}</p>
    <p>response: {devicesArray}</p>
      {devices.length === 0 ? (
        <p>You have no devices.</p>
      ) : (
        devices.map((device) => (
          <Link to="/raspberrypi" className="device-link" key={device._id}>
            <div className="device">
              <div className='device-outer-container'>
                <h2 className='header-2'>Device</h2>
                <div className="device-container">
                  <img src={image} alt="Device" className="device-image" />
                  <div className="device-info">
                    <p><strong>Device Name:</strong> {device.device_name}</p>
                    <p><strong>Device Serial Number:</strong> {device._id}</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default Device;
