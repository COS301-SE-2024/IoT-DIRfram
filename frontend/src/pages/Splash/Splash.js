import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Preloader from './Preloader';
import './Splash.css';

function Splash() {
  const [showContent, setShowContent] = useState(false);

  const handleAnimationEnd = () => {
    setShowContent(true);
  };

  return (
    <>
      <Preloader onAnimationEnd={handleAnimationEnd} />
      <div className={`splash-page ${showContent ? 'show' : 'hide'}`}>
        <div className="button-container">
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/signup" className="signup-btn">Signup</Link>
        </div>
        <div className="content">
          <h1>Welcome to Code Crafters</h1>
          <p>This project aims to develop software for a Raspberry Pi that automatically executes when connected via USB or UART to retrieve information from an IoT device. The software will gather details such as firmware version, chip model, and voltage usage, compiling them into an XML format. This information can be stored onboard the Raspberry Pi or transmitted to another system for analysis.</p>
        </div>
      </div>
    </>
  );
}

export default Splash;
