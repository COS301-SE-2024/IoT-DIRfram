import React from 'react';
import Header from '../../components/Header/Header';
import IoT_Device from '../../components/IOT_DEVICE/IOT_DEVICE';
import './RaspberryPi.css';

function RaspberryPi() {
  return (
    <div className="raspberry-pi">
      <Header />
      <div className="iot-content">
        <h1 className="devices-title">IoT Devices</h1>
        <hr />
        {/* eslint-disable-next-line react/jsx-pascal-case */}
        <IoT_Device />
      </div>
    </div>
  );
}

export default RaspberryPi;
