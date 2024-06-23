// Modal.js
import './help.css'; // Import your CSS file
import React from 'react';
import { Carousel } from 'react-responsive-carousel'; // Import Carousel
import { FaTimes } from 'react-icons/fa'; // Import FontAwesome icon
import Raspberrypi1 from '../../assets/Raspberrypi1.jpeg';
import Raspberrypi2 from '../../assets/Raspberrypi2.jpeg';
import Raspberrypi3 from '../../assets/Raspberrypi3.jpeg';
import Raspberrypi4 from '../../assets/Raspberrypi4.jpeg';

const Modal = ({ onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className='close'>
                    <FaTimes /> {/* FontAwesome close icon */}
                </button>
                <div style={{ width: '90%', height: '50%', margin: 'auto', position: 'relative' }}>
                    <Carousel
                        infiniteLoop
                        showThumbs={false}
                        showStatus={false}
                        showIndicators={false}
                        style={{ width: '100%', height: '50%' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>Text</div>
                            <img src={Raspberrypi1} alt="Image 1" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>Text</div>
                            <img src={Raspberrypi2} alt="Image 2" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>Text</div>
                            <img src={Raspberrypi3} alt="Image 3" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>Text</div>
                            <img src={Raspberrypi4} alt="Image 4" style={{ width: '50%', height: 'auto' }} />
                        </div>
                    </Carousel>
                </div>
            </div>
        </div>
    );
};

export default Modal;
