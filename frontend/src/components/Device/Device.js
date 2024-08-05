import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Device.css'; 
import image from '../../assets/rpi.png'; 

const Device = () => {
  const [devices, setDevices] = useState([]);
  const [username, setUsername] = useState(''); 

  useEffect(() => {
    const storedUsername = Cookies.get("username"); 
    setUsername(storedUsername);

    const fetchDevices = async () => {
      const body = JSON.stringify({ username: storedUsername }); // Construct the JSON body
    
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/device/devicesForUser`, {
          method: 'POST', // Change to POST
          headers: {
            'Content-Type': 'application/json',
          },
          body: body, // Send the constructed body
        });
        if (!response.ok) {
          throw new Error('Failed to fetch devices');
        }
        const data = await response.json();
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
