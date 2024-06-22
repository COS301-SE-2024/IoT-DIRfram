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
        </div>
    );
};

export default Modal;
