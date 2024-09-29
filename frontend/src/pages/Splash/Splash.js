import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel'; // Import Carousel
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import Carousel styles
import React from 'react';
import Preloader from './Preloader';
import './Splash.css';
import Raspberrypi1 from '../../assets/Raspberrypi1.jpeg';
import Raspberrypi2 from '../../assets/Raspberrypi2.jpeg';
import Raspberrypi3 from '../../assets/Raspberrypi3.jpeg';
import Raspberrypi4 from '../../assets/Raspberrypi4.jpeg';
// import Raspberrypi5 from '../../assets/Raspberrypi5.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Ensure you import FontAwesomeIcon
import { faGithub } from '@fortawesome/free-brands-svg-icons'; // Change this line


function Splash() {
  // const [showContent, setShowContent] = useState(false);

  // const handleAnimationEnd = () => {
  //   setShowContent(true);
  // };

  return (
    <>
      <Preloader />
      <div className="splash-page">
        <div className='splash-content'>
          <h1 style={{ textAlign: 'center' }}>IoT Data Extraction</h1>
          <div className='outer-container'>
            <div className="content">
              <h1>Welcome to IoT-DIRfram</h1>
              <h2>We are Code Crafters</h2>
              <p className='p-splash'>This project aims to develop software for a Raspberry Pi that automatically executes when connected via USB or UART to retrieve information from an IoT device. The software will gather details such as firmware version, chip model, and voltage usage, compiling them into an XML format. This information can be stored onboard the Raspberry Pi or transmitted here for analysis.</p>
              <p>
                <a href="https://github.com/COS301-SE-2024/IoT-DIRfram" target="_blank" rel="noopener noreferrer" ><FontAwesomeIcon icon={faGithub} style={{ marginRight: '5px' }} /> Git Repo</a>
                {/* style={{ color: '#1FB079' }} */}
              </p>
              <header className="buttons">
                <Link to="/login" className="login-btn">Login</Link>
                <Link to="/signup" className="signup-btn">Signup</Link>
              </header>

            </div>
            <div className='carousel-container'>
              <Carousel
                className='splash-carousel'
                autoPlay
                interval={3000}
                infiniteLoop
                showThumbs={false}
                showStatus={false}
                showIndicators={false}>
                <div>
                  <img src={Raspberrypi1} alt="Image-1" />
                </div>
                <div>
                  <img src={Raspberrypi2} alt="Image-2" />
                </div>
                <div>
                  <img src={Raspberrypi3} alt="Image-3" />
                </div>
                <div>
                  <img src={Raspberrypi4} alt="Image-4" />
                </div>
                {/* <div>
                  <img src={Raspberrypi5} alt="Image-4" />
                </div> */}
              </Carousel>
            </div>
          </div>
          <footer className='footerSplash'>
            <p>Should you encounter any issues or require any assistance,
              please let us know at <a href="mailto:codecrafters2024.capstone@gmail.com">codecrafters2024.capstone@gmail.com</a>
            </p>
            <p>&copy; 2024 IoT-DIRfram</p>
          </footer>
        </div>
      </div>
    </>
  );
}

export default Splash;
