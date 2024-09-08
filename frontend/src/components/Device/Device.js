import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Device.css';
import image from '../../assets/rpi.png';
import orangeImage from '../../assets/orange-cropped.svg'; // Import the SVG
import Modal from './Modal';

const Device = () => {
  const [devices, setDevices] = useState([]);
  const [username, setUsername] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
        // console.log('Devices:', data);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    if (username) {
      fetchDevices();
    }
  }, [username]);

  const handleRemove = async (device_id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/device/removeDeviceFromUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ device_id, username }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove device');
      }

      setDevices(devices.filter(device => device._id !== device_id));
    } catch (error) {
      console.error('Error removing device:', error);
    }
  };

  const handleEdit = (device) => {
    setCurrentDevice(device);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentDevice(null);
  };

  const handleSaveDeviceName = async (newDeviceName) => {
    if (!currentDevice) return;

    const body = JSON.stringify({
      device_id: currentDevice._id,
      device_name: newDeviceName,
      username
    });

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/device/updateDeviceName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      if (!response.ok) {
        throw new Error('Failed to update device name');
      }

      const updatedDevices = devices.map(device => {
        if (device._id === currentDevice._id) {
          return { ...device, custom_name: newDeviceName };
        }
        return device;
      });
      setDevices(updatedDevices);
      handleCloseModal();
    } catch (error) {
      console.error('Error updating device name:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredDevices = devices.filter(device =>
    (device.custom_name && device.custom_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (device.device_name && device.device_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="devices-list">
      <div className='inputDiv'>
        <input
          type="text"
          placeholder="Search by device name or custom name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar"
        />
      </div>
      {filteredDevices.length === 0 ? (
        <p>No devices found.</p>
      ) : (
        filteredDevices.map((device) => (
          <div className="device" key={device._id}>
            <div className='device-outer-container'>
              <h2 className='header-2'>{device.custom_name || 'Device'}</h2>
              <div className="device-container">
                <Link
                  to="/raspberrypi"
                  className="device-link"
                  onClick={() => {
                    Cookies.set('deviceId', device._id);

                    // Check if the isAdmin property exists and set it in cookies if it does
                    // console.log('device:', device);
                    if (device.isAdmin) {
                      // console.log('isAdmin:', device.isAdmin);
                      Cookies.set('isAdmin', device.isAdmin);
                    }
                    else
                    {
                      // console.log('isAdmin:', false);
                      Cookies.set('isAdmin', false);
                    }
                  }}
                >

                  <img
                    src={device.device_name === "raspberrypi" ? image : orangeImage}
                    alt="Device"
                    className="device-image"
                  />
                  <div className="device-info">
                    <p><strong>Device Name:</strong> {device.device_name || 'Device'}</p>
                    <p><strong>Device Serial Number:</strong> {device._id}</p>
                  </div>
                </Link>
              </div>
              <div className="button-group">
                <button className="edit-button-device" onClick={() => handleEdit(device)}>Edit</button>
                <button className="remove-button" onClick={() => handleRemove(device._id)}>Remove</button>
              </div>
            </div>
          </div>
        ))
      )}
      <Modal
        show={showModal}
        handleClose={handleCloseModal}
        handleSave={handleSaveDeviceName}
        deviceName={currentDevice?.device_name || ''}
      />
    </div>
  );
};

export default Device;
