import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import './IoT-Device.css';

const IoT_Device = () => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchedDevices = [
      {
        id: 1,
        name: 'Device 1',
        descriptions: ['firmware version', 'chip model', 'voltage usage'],
      },
      {
        id: 2,
        name: 'Device 2',
        descriptions: ['firmware version', 'chip model', 'voltage usage'],
      },
      {
        id: 3,
        name: 'Device 3',
        descriptions: ['firmware version', 'chip model', 'voltage usage'],
      },
    ];
    setDevices(fetchedDevices);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      const updatedDevices = devices.filter(device => device.id !== id);
      setDevices(updatedDevices);
      console.log(`Delete device with ID: ${id}`);
    }
  };

  return (
    <div className="devices-list">
      {devices.length === 0 ? (
        <p>No IoT devices connected.</p>
      ) : (
        devices.map((device) => (
          <div key={device.id} className="device-item">
            <h2>{device.name}</h2>
            <hr />
            {device.descriptions.map((description, index) => (
              <p key={index}>{description}</p>
            ))}
            <div className="buttons-container">
              <Link to="/iot-edit" className="icon-button edit-button">
                <FontAwesomeIcon icon={faEdit} size="2x" />
              </Link>
              <button className="icon-button delete-button" onClick={() => handleDelete(device.id)}>
                <FontAwesomeIcon icon={faTrashAlt} size="2x" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default IoT_Device;
