import React, { useState, useEffect } from 'react';
import './Settings.css';
import Header from '../../components/Header/Header';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    newDataAvailable: true,
    newResponseToPosts: true,
  });
  const username = Cookies.get("username"); // Get the username from cookies
  const [unsavedChanges, setUnsavedChanges] = useState(false); // State to track unsaved changes

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/getUserData`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
          }),
        });
  
        if (response.ok) {
          const userData = await response.json();
          // If userData.notifications doesn't exist, default to an empty object
          setNotifications(userData.notifications ?? {});
          // console.log('User data fetched successfully:', userData);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, [username]); // Only re-run when username changes  
  
  useEffect(() => {
    // Check if there are any unsaved changes
    const changesExist = JSON.stringify(notifications) !== JSON.stringify({
      newDataAvailable: true,
      newResponseToPosts: true,
    });

    setUnsavedChanges(changesExist); // Update unsaved changes state
  }, [notifications]);

  const handleNotificationChange = (event) => {
    const { name, checked } = event.target;
    // console.log(name, checked);
    setNotifications({ ...notifications, [name]: checked });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/updateNotifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username, // Replace with the actual username from the logged-in user context
          notifications: notifications,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        // console.log(data.message);
        setUnsavedChanges(false); // Reset unsaved changes state after saving
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="settings">
      <Header />
      <motion.div 
        className="settings-header"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 className='settings-title' variants={itemVariants}>Settings</motion.h2>
        <motion.p variants={itemVariants}>
          <small style={{ color: '#B7B5B7'}}>
            <span style={{color: 'white'}}>HINT:</span> Don't forget to consult our guide if you need help or get stuck 
            <span style={{color: 'white'}}>*<span style={{color: '#007BFF'}}>blue icon</span> - bottom right</span>
          </small>
        </motion.p>
        <motion.p variants={itemVariants}>
          <small style={{ color: '#B7B5B7'}}>
            <span style={{color: 'white'}}>Make sure to click on save after you have made your changes</span>
          </small>
        </motion.p>
      </motion.div>

      <motion.div 
        className="settings-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <hr className="section-break" />
        <div className='settings-list'>
          <div className='setting-item'>
            <label>Receive an email notification for the following:</label>
            <div className='notification-options'>
              <motion.p variants={itemVariants}>
                <input
                  type="checkbox"
                  name="newDataAvailable"
                  checked={notifications.newDataAvailable}
                  onChange={handleNotificationChange}
                  className="checkbox-round"
                />
                When new IoT data is uploaded
              </motion.p>
              <motion.p variants={itemVariants}>
                <input
                  type="checkbox"
                  name="newResponseToPosts"
                  checked={notifications.newResponseToPosts}
                  onChange={handleNotificationChange}
                  className="checkbox-round"
                />
                When there's a new response to my posts
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Save button at the bottom center */}
      <button className={`save-button ${unsavedChanges ? 'green' : 'grey'}`} onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
}

export default Settings;