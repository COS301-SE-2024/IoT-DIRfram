import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel'; // Import Carousel
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import Carousel styles
import Preloader from './Preloader';
import './Splash.css';
import React, { useState } from 'react';
import Raspberrypi1 from '../../assets/Raspberrypi1.jpeg';
import Raspberrypi2 from '../../assets/Raspberrypi2.jpeg';
import Raspberrypi3 from '../../assets/Raspberrypi3.jpeg';
import Raspberrypi4 from '../../assets/Raspberrypi4.jpeg';

function Splash() {
  const [showContent, setShowContent] = useState(false);

  const handleAnimationEnd = () => {
    setShowContent(true);
  };

  return (
    <>
      <Preloader />
      <div className="splash-page">
        <header className="buttons">
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/signup" className="signup-btn">Signup</Link>
        </header>
        <div className="content">
          <h1>Welcome to IoT-DIRfram</h1>
          <h2>We are Code Crafters</h2>
          <p>This project aims to develop software for a Raspberry Pi that automatically executes when connected via USB or UART to retrieve information from an IoT device. The software will gather details such as firmware version, chip model, and voltage usage, compiling them into an XML format. This information can be stored onboard the Raspberry Pi or transmitted to another system for analysis.</p>
        </div>
        <Carousel>
          <div>
            <img src={Raspberrypi1} alt="Image 1" />
          </div>
          <div>
            <img src={Raspberrypi2} alt="Image 2" />
          </div>
          <div>
            <img src={Raspberrypi3} alt="Image 3" />
          </div>
          <div>
            <img src={Raspberrypi4} alt="Image 4" />
          </div>
        </Carousel>
      </div>
    </>
  );
}

export default Splash;
