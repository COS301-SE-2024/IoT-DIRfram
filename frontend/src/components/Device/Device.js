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
      const body = JSON.stringify({ username: storedUsername });

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/device/devicesForUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: body,
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

  const handleRemove = async (deviceId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/device/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deviceId, username }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove device');
      }

      setDevices(devices.filter(device => device._id !== deviceId));
    } catch (error) {
      console.error('Error removing device:', error);
    }
  };


  const handleEdit = (deviceId) => {
    // Add logic to handle editing the device
    console.log(`Editing device: ${deviceId}`);
  };

  return (
    <div className="devices-list">
      {devices.length === 0 ? (
        <p>You have no devices.</p>
      ) : (

        devices.map((device) => (
          <div className="device" key={device._id}>
            <div className='device-outer-container'>
              <h2 className='header-2'>Device</h2>
              <div className="device-container">
                <Link
                  to="/raspberrypi" // Change to direct path
                  className="device-link"
                  onClick={() => Cookies.set('deviceId', device._id)} // Set deviceId in cookies
                >
                  <img src={image} alt="Device" className="device-image" />
                  <div className="device-info">
                    <p><strong>Device Name:</strong> {device.device_name}</p>
                    <p><strong>Device Serial Number:</strong> {device._id}</p>
                  </div>
                </Link>
              </div>
              <div className="button-group">
                <button className="edit-button" onClick={() => handleEdit(device._id)}>Edit</button>
                <button className="remove-button" onClick={() => handleRemove(device._id)}>Remove</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Device;
