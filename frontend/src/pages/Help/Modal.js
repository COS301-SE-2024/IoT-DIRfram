// Modal.js
import './help.css'; // Import your CSS file
import React from 'react';
import { Carousel } from 'react-responsive-carousel'; // Import Carousel
import { FaTimes } from 'react-icons/fa'; // Import FontAwesome icon
import AboutPoint from '../../assets/help_images/about_point.png';
import About from '../../assets/help_images/about.png';
import AddDevice from '../../assets/help_images/add_device.png';
import AddDevicePoint from '../../assets/help_images/add_device_point.png';
import CreatePost from '../../assets/help_images/create_post.png';
import DashPoint from '../../assets/help_images/dash_point.png';
import DataPoint from '../../assets/help_images/data_point.png';
import DeletePoint from '../../assets/help_images/delete_point.png';
import DeletePrompt from '../../assets/help_images/delete_prompt.png';
import DeviceButtons from '../../assets/help_images/device_buttons.png';
import DevicePoint from '../../assets/help_images/device_point.png';
import DownloadPoint from '../../assets/help_images/download_point.png';
import DownloadPrompt from '../../assets/help_images/download_prompt.png';
import EditDevice from '../../assets/help_images/edit_device.png';
import HeaderPoint from '../../assets/help_images/header_point.png';
import HelpPoint from '../../assets/help_images/help_point.png';
import IotCompare from '../../assets/help_images/iot_compare.png';
import IotCurrentButtons from '../../assets/help_images/iot_current_buttons.png';
import Iot_Device from '../../assets/help_images/iot_device.png';
import IotGraph from '../../assets/help_images/iot_graph.png';
import IotInfoPoint from '../../assets/help_images/iot_info_point.png';
import IotPage from '../../assets/help_images/iot_page.png';
import IotPoint from '../../assets/help_images/iot_point.png';
import IotSearch from '../../assets/help_images/iot_search.png';
import LogoutPoint from '../../assets/help_images/logout_point.png';
import MainPoint from '../../assets/help_images/main_point.png';
import MenuPoint from '../../assets/help_images/menu_point.png';
import NavPoint from '../../assets/help_images/nav_point.png';
import PostDetails from '../../assets/help_images/post_details.png';
import PostText from '../../assets/help_images/post_text.png';
import Posts from '../../assets/help_images/posts.png';
import PostsCreate from '../../assets/help_images/posts_create.png';
import PostsDelete from '../../assets/help_images/posts_delete.png';
import PostsSearch from '../../assets/help_images/posts_search.png';
import Profile from '../../assets/help_images/profile.png';
import Responses from '../../assets/help_images/responses.png';
import Settings from '../../assets/help_images/settings.png';
import SideNavPoint from '../../assets/help_images/side_nav_point.png';
import SidePoint from '../../assets/help_images/side_point.png';
import Logo from '../../assets/help_images/logo.png';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons'; // Change this line



const Modal = ({ onClose }) => {
    return (
        <div className="modal-overlay-help" onClick={onClose}>
            <div className="modal-content-help" onClick={(e) => e.stopPropagation()}>
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
                            <div style={{ paddingLeft: '10px', paddingRight: '10px' }} >
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
                                <h3>Dashboard - Add Button</h3>
                                <p>Located in the top right, this feature allows you to link a Raspberry pi to your account using the <span style={{ color: "#A11117" }}><strong>Serial number</strong></span> of your pi. If you are the <i>First/Sole</i> user for that pi, you will be able to <i>Delete</i> data from that device.</p>
                            </div>
                            <img src={AddDevicePoint} alt="Device Pointer" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Dashboard - Add prompt</h3>
                                <p>Here you can enter the <span style={{ color: "#A11117" }}><strong>Serial number</strong></span> of your pi. You need to click <i>Save</i> in order for it to work.</p>
                            </div>
                            <img src={AddDevice} alt="Device Pointer" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Dashboard - Pi Device</h3>
                                <p>This is the available devices on our system. We display the <span style={{ color: "#A11117" }}><strong>Name and Serial number</strong></span> of the device and clicking on it will take you to our <i>IoT Device</i> page.</p>
                            </div>
                            <img src={DevicePoint} alt="Device Pointer" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Dashboard - Pi Device</h3>
                                <p>These buttons allow you to Personalise the name of the device or remove it from your account. Clicking on the <span style={{ color: "#A11117" }}><strong>Edit</strong></span> button will bring up the <i>Edit Prompt</i>.</p>
                            </div>
                            <img src={DeviceButtons} alt="Device Buttons" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Dashboard - Edit Prompt</h3>
                                <p>Here you can enter a personal name for a pi. This allows you to distinguish different devices that may have the same <span style={{ color: "#A11117" }}><strong>Device Name</strong></span>.</p>
                            </div>
                            <img src={EditDevice} alt="Device Buttons" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>IoT Device Page</h3>
                                <p>Here you can view all <span style={{ color: "#A11117" }}><strong>Iot Data</strong></span> that has been extracted using the selected Raspberry Pi.</p>
                            </div>
                            <img src={IotPage} alt="Iot Page" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>IoT Device Page - Search</h3>
                                <p>Here you can search for data extracted within a given range. The <i>To</i> range can be excluded, however the <span style={{ color: "#A11117" }}><strong>From</strong></span> range is required.</p>
                            </div>
                            <img src={IotSearch} alt="Iot Page" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>IoT Device Page - Device</h3>
                                <p>This shows the various IoT Devices along with the <span style={{ color: "#A11117" }}><strong>Date</strong></span> they were extracted.</p>
                            </div>
                            <img src={Iot_Device} alt="Iot Page" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>IoT Device Page - Details</h3>
                                <p>Here you can view all <span style={{ color: "#A11117" }}><strong>Serial data</strong></span> that has been extracted using the selected Raspberry Pi.</p>
                            </div>
                            <img src={IotPoint} alt="Iot Page" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>IoT Device Page - Download Button</h3>
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
                                <h3>IoT Device Page - Current Buttons</h3>
                                <p>You can click these to download the <span style={{ color: "#A11117" }}><strong>Current</strong></span> data as a <span style={{ color: "#A11117" }}><strong>.csv</strong></span> file or you can compare the <i>Current</i> with current of <i>Another</i> device.</p>
                            </div>
                            <img src={IotCurrentButtons} alt="Download Button" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>IoT Device Page - Delete Button</h3>
                                <p>Allows a user to remove device info. This will prompt you to delete said device info. This button will only appear if you are an <span style={{ color: "#A11117" }}><strong>Admin</strong></span>.</p>
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
                                <h3>IoT Device Page - IoT Info</h3>
                                <p>This section lists the <span style={{ color: "#A11117" }}><strong>Firmware and Chip info</strong></span> that has been extracted from a selected IoT device.</p>
                            </div>
                            <img src={IotInfoPoint} alt="IoT Firmware info" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>IoT Device Page - Raw data</h3>
                                <p>Preview of the entirety of the raw data extracted. This is the data that will be downloaded.</p>
                            </div>
                            <img src={DataPoint} alt="Raw data info" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>IoT Device Page - Current Graph</h3>
                                <p>This shows the <span style={{ color: "#A11117" }}><strong>Current</strong></span> data extracted using the voltmeter extension. Each point represents the current recorded at an interval of 0.5s.</p>
                            </div>
                            <img src={IotGraph} alt="Raw data info" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>IoT Device Page - Comparison Graph</h3>
                                <p>This shows the <span style={{ color: "#A11117" }}><strong>Current</strong></span> data of two devices, <i>Side-by-side</i>. This can be accessed by clicking the <i>Compare Current</i> button.</p>
                            </div>
                            <img src={IotCompare} alt="Raw data info" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Posts Page</h3>
                                <p>This page allows users to Ask and Respond to questions in an open way, allowing other users the opportunity to respond to queries.</p>
                            </div>
                            <img src={Posts} alt="Iot Page" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Posts Page - Search</h3>
                                <p>Here you can search for a query based on a keyword in the <i>Title</i> or you can view your own posts.</p>
                            </div>
                            <img src={PostsSearch} alt="Iot Page" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Posts Page - Create Button</h3>
                                <p>This will bring up the <i>Create Posts</i> prompt.</p>
                            </div>
                            <img src={PostsCreate} alt="Iot Page" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Posts Page - Create Prompt</h3>
                                <p>This allows you to ask a question to other users regarding issues you may face. You need to include a <span style={{ color: "#A11117" }}><strong>Title</strong></span> and <span style={{ color: "#A11117" }}><strong>Description</strong></span>.</p>
                            </div>
                            <img src={CreatePost} alt="Iot Page" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Posts Page - Post Text</h3>
                                <p>This shows the <span style={{ color: "#A11117" }}><strong>Title</strong></span> of a post as well as the <span style={{ color: "#A11117" }}><strong>User</strong></span> who posted it. Clicking on the <i>Title</i> will take you to the post.</p>
                            </div>
                            <img src={PostText} alt="Iot Page" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Posts Page - Delete Icon</h3>
                                <p>If you feel your question has been answered, or the post is concluded, you can delete the post and all replies. Caution, this is <span style={{ color: "#A11117" }}><strong>PERMANENT</strong></span>.</p>
                            </div>
                            <img src={PostsDelete} alt="Iot Page" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Posts Page - Post Details</h3>
                                <p>Here you can view the details regarding a post, as well as view other users' replies, or you can respond if you want to help.</p>
                            </div>
                            <img src={PostDetails} alt="Iot Page" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Posts Page - Post Responses</h3>
                                <p>You can up or downvote a response if you feel it is <i>Helpful/unhelpful</i>. Posts are organised based on their helpfulness.</p>
                            </div>
                            <img src={Responses} alt="Iot Page" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Profile Page</h3>
                                <p>Here you can view and modify your details, including your login credentials. The optional fields are for us to record potential statistics based on our users.</p>
                            </div>
                            <img src={Profile} alt="Iot Page" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>
                                <h3>Settings Page</h3>
                                <p>Here you can modify whether you want to receive emails regarding the uploading of data to the pis linked to your account, as well as emails for when a user responds to your post.</p>
                            </div>
                            <img src={Settings} alt="Iot Page" style={{ width: '50%', height: 'auto' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: '1' }}>If you face any issues or want to reach out <br /> please send us an email: <br /> <a href="mailto:codecrafters2024.capstone@gmail.com">codecrafters2024.capstone@gmail.com</a> <br/><p>
                            or check out our <a href="https://github.com/COS301-SE-2024/IoT-DIRfram" target="_blank" rel="noopener noreferrer" ><FontAwesomeIcon icon={faGithub} style={{ marginRight: '5px' }} /> Git Repo</a>
                                {/* style={{ color: '#1FB079' }} */}
                            </p></div>
                            <img src={Logo} alt="Logo" style={{ width: '50%', height: 'auto' }} />
                        </div>
                    </Carousel>
                </div>
            </div>
        </div>
    );
};

export default Modal;
