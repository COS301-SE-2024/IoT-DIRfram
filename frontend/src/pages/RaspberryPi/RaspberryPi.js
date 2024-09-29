import React from 'react';
import Header from '../../components/Header/Header';
import IOT_DEVICE from '../../components/IOT_DEVICE/IOT_DEVICE';
import './RaspberryPi.css';
import Cookies from 'js-cookie'; // Make sure to import this
import { motion } from 'framer-motion';

function RaspberryPi() {
  const deviceId = Cookies.get('deviceId') || ''; // Retrieve deviceId from cookies
  const isAdmin = Cookies.get('isAdmin') || false; // Retrieve isAdmin from cookies

  return (
    <div className="raspberry-pi">
      <Header />
      <motion.div 
        className="iot-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <h1 className="devices-title">IoT Devices</h1>
        <p><small style={{ color: '#B7B5B7'}}><span style={{color: 'white'}}>HINT:</span> Don't forget to consult our guide if you need help or get stuck <span style={{color: 'white'}}>*<span style={{color: '#007BFF'}}>blue icon</span> - bottom right</span></small></p>
        <hr />
        {/* Pass the deviceId to IoT_Device */}
        <IOT_DEVICE deviceId={deviceId} isAdmin={isAdmin}/>
      </motion.div>
    </div>
  );
}

export default RaspberryPi;