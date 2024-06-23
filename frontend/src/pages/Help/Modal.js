// Modal.js
import './help.css'; // Import your CSS file
import React from 'react';
import { Carousel } from 'react-responsive-carousel'; // Import Carousel
import { FaTimes } from 'react-icons/fa'; // Import FontAwesome icon
import AboutPoint from '../../assets/help_images/about_point.png';
import About from '../../assets/help_images/about.png';
import DashPoint from '../../assets/help_images/dash_point.png';
import DataPoint from '../../assets/help_images/data_point.png';
import DeletePoint from '../../assets/help_images/delete_point.png';
import DeletePrompt from '../../assets/help_images/delete_prompt.png';
import DevicePoint from '../../assets/help_images/device_point.png';
import DownloadPoint from '../../assets/help_images/download_point.png';
import DownloadPrompt from '../../assets/help_images/download_prompt.png';
import HeaderPoint from '../../assets/help_images/header_point.png';
import HelpPoint from '../../assets/help_images/help_point.png';
import IotInfoPoint from '../../assets/help_images/iot_info_point.png';
import IotPoint from '../../assets/help_images/iot_point.png';
import LogoutPoint from '../../assets/help_images/logout_point.png';
import MainPoint from '../../assets/help_images/main_point.png';
import MenuPoint from '../../assets/help_images/menu_point.png';
import NavPoint from '../../assets/help_images/nav_point.png';
import SideNavPoint from '../../assets/help_images/side_nav_point.png';
import SidePoint from '../../assets/help_images/side_point.png';
import Logo from '../../assets/help_images/logo.png';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
                            <div style={{ flex: '1' }}>
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </div>
                            <div style={{paddingLeft: '10px', paddingRight: '10px'}} >
                                <h3>Help Menu</h3>
                                <p>Here you can find help relating to the <i>Features</i> of our application, find out what something does, or contact us for help. You can naviage by clicking the icons on the edge of this modal. You can close this at any time by clicking the <strong>'x'</strong> icon or clicking outside of the white box.</p>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faArrowRight} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Dashboard</h3>
                                <p>The <i>Dashboard</i> is the main page of the website, it lists the Raspberry Pis currently on the system as well as info about these devices.</p>
                            </div>
                            <img src={DashPoint} alt="Dashboard Info" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Menu Button</h3>
                                <p>This is the <i>Menu</i> button. It appears in the top left. Clicking it will expand the side-menu.</p>
                            </div>
                            <img src={MenuPoint} alt="Menu Pointer" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Side-menu</h3>
                                <p>This is the side menu. It appears after the <i>Menu</i>button is clicked. This allows you to navigate to various pages as well as log out.</p>
                            </div>
                            <img src={SidePoint} alt="Side Menu" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Pages</h3>
                                <p>This lists the various pages that are currently accessible.</p>
                            </div>
                            <img src={SideNavPoint} alt="Side Navigation Info" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Logout</h3>
                                <p>This button will log you out. It appears in the bottom of the side menu. This returns you to our splash page.</p>
                            </div>
                            <img src={LogoutPoint} alt="Logout button" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Navigation</h3>
                                <p>These appear in the top right. You can use these icons to navigate between previously accessed tabs/pages.</p>
                            </div>
                            <img src={NavPoint} alt="Navigation Pointer" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Help Icon</h3>
                                <p>This icon is how you got here. It appears in the bottom right.</p>
                            </div>
                            <img src={HelpPoint} alt="Help Pointer" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Header</h3>
                                <p>The header includes our <i>Name</i>, <i>Navigation</i>, <i>About</i> icon as well as <i>Menu</i> icon. The header is fixed to the top of the page.</p>
                            </div>
                            <img src={HeaderPoint} alt="Header Pointer" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>About icon</h3>
                                <p>This takes you to the <i>About</i> section of our web application.</p>
                            </div>
                            <img src={AboutPoint} alt="About Pointer" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>About</h3>
                                <p>This page relates to documentation and Architectural requirements of our application.</p>
                            </div>
                            <img src={About} alt="About Page" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Title</h3>
                                <p>Click on our Name to return to the <i>Dashboard</i> at any time.</p>
                            </div>
                            <img src={MainPoint} alt="Title Pointer" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Pi Device</h3>
                                <p>This is the available devices on our system. We display the <span style={{ color: "#A11117" }}><strong>Name and Serial number</strong></span> of the device and clicking on it will take you to our <i>IoT Device</i> page.</p>
                            </div>
                            <img src={DevicePoint} alt="Device Pointer" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>IoT Device Page</h3>
                                <p>Here you can view all <span style={{ color: "#A11117" }}><strong>Serial data</strong></span> that has been extracted using the selected Raspberry Pi.</p>
                            </div>
                            <img src={IotPoint} alt="Iot Page" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Download Button</h3>
                                <p>You can click this to bring up a prompt to download the data log as either <span style={{ color: "#A11117" }}><strong>text</strong></span> or<span style={{ color: "#A11117" }}><strong> XML</strong></span>.</p>
                            </div>
                            <img src={DownloadPoint} alt="Download Button" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Download Prompt</h3>
                                <p>Enter the format of the file you want to download. eg. <i>'text'</i></p>
                            </div>
                            <img src={DownloadPrompt} alt="Download Prompt" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Delete Button</h3>
                                <p>Allows a user to remove device info. This will prompt you to delete said device info.</p>
                            </div>
                            <img src={DeletePoint} alt="Delete Button" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Delete Prompt</h3>
                                <p>Prompt asking if a user wants to delete a device. Clicking <i>Okay</i> will delete this info <span style={{ color: "#A11117" }}><strong>PERMANENTLY</strong></span>.</p>
                            </div>
                            <img src={DeletePrompt} alt="Delete Prompt" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>IoT Info</h3>
                                <p>This section lists the <span style={{ color: "#A11117" }}><strong>Firmware and Chip info</strong></span> that has been extracted from a selected IoT device.</p>
                            </div>
                            <img src={IotInfoPoint} alt="IoT Firmware info" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Raw data</h3>
                                <p>Preview of the entirety of the raw data extracted. This is the data that will be downloaded.</p>
                            </div>
                            <img src={DataPoint} alt="Raw data info" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>If you face any issues or want to reach out <br /> please send us an email: <br /> <a href="mailto:codecrafters2024.capstone@gmail.com">codecrafters2024.capstone@gmail.com</a></div>
                            <img src={Logo} alt="Logo" style={{ width: '50%', height: 'auto' }} />
                        </div>
                    </Carousel>
                </div>
            </div>
        </div>
    );
};

export default Modal;
