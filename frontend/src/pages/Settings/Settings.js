import React, { useState, useEffect } from 'react';
import './Settings.css';
import Header from '../../components/Header/Header';

const Settings = () => {
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState({
    deviceConnects: true,
    deviceDisconnects: true,
    newDataAvailable: true,
    userLogsIn: true,
    dataDeleted: true,
    dataAdded: true,
  });
  const [viewMode, setViewMode] = useState('grid');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false); // State to track unsaved changes

  useEffect(() => {
    // Check if there are any unsaved changes
    const changesExist =
      theme !== 'light' ||
      JSON.stringify(notifications) !==
        JSON.stringify({
          deviceConnects: true,
          deviceDisconnects: true,
          newDataAvailable: true,
          userLogsIn: true,
          dataDeleted: true,
          dataAdded: true,
        }) ||
      viewMode !== 'grid' ||
      twoFactorAuth !== false;

    setUnsavedChanges(changesExist); // Update unsaved changes state
  }, [theme, notifications, viewMode, twoFactorAuth]);

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  const handleNotificationChange = (event) => {
    const { name, checked } = event.target;
    setNotifications({ ...notifications, [name]: checked });
  };

  const handleViewModeChange = (event) => {
    setViewMode(event.target.value);
  };

  const handleTwoFactorAuthToggle = () => {
    setTwoFactorAuth(!twoFactorAuth);
  };

  const handleSave = () => {
    // Logic to save changes
    setUnsavedChanges(false); // Reset unsaved changes state after saving
  };

  return (
    <div className="settings">
      <Header />
      <div className="settings-header">
        <h2 className='settings-title'>Settings</h2>
        <p><small style={{ color: '#B7B5B7'}}><span style={{color: 'white'}}>HINT:</span> Don't forget to consult our guide if you need help or get stuck <span style={{color: 'white'}}>*<span style={{color: '#007BFF'}}>blue icon</span> - bottom right</span></small></p>
        <p><small style={{ color: '#B7B5B7'}}><span style={{color: 'white'}}>Make sure to click on save after you have made your changes</span></small></p>
      </div>

      <div className="settings-content">
        <hr className="section-break" />
        <div className='settings-list'>
          <div className='setting-item'>
            <label htmlFor="theme">Theme:</label>
            <select id="theme" value={theme} onChange={handleThemeChange} className="small-input">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className='setting-item'>
            <label>Notifications:</label>
            <div className='notification-options'>
              <label>
                <input
                  type="checkbox"
                  name="deviceConnects"
                  checked={notifications.deviceConnects}
                  onChange={handleNotificationChange}
                />
                When device connects
              </label>
              <label>
                <input
                  type="checkbox"
                  name="deviceDisconnects"
                  checked={notifications.deviceDisconnects}
                  onChange={handleNotificationChange}
                />
                When device disconnects
              </label>
              <label>
                <input
                  type="checkbox"
                  name="newDataAvailable"
                  checked={notifications.newDataAvailable}
                  onChange={handleNotificationChange}
                />
                When new data is available
              </label>
              <label>
                <input
                  type="checkbox"
                  name="userLogsIn"
                  checked={notifications.userLogsIn}
                  onChange={handleNotificationChange}
                />
                When user logs in
              </label>
              <label>
                <input
                  type="checkbox"
                  name="dataDeleted"
                  checked={notifications.dataDeleted}
                  onChange={handleNotificationChange}
                />
                When data is deleted
              </label>
              <label>
                <input
                  type="checkbox"
                  name="dataAdded"
                  checked={notifications.dataAdded}
                  onChange={handleNotificationChange}
                />
                When data is added
              </label>
            </div>
          </div>

          <div className='setting-item'>
            <label htmlFor="viewMode">View Mode:</label>
            <select id="viewMode" value={viewMode} onChange={handleViewModeChange} className="small-input">
              <option value="table">Table</option>
              <option value="grid">Grid</option>
            </select>
          </div>

          <div className='setting-item'>
            <label>Two-Factor Authentication:</label>
            <button
              className={`toggle-button ${twoFactorAuth ? 'enabled' : 'disabled'}`}
              onClick={handleTwoFactorAuthToggle}
            >
              {twoFactorAuth ? 'Disable' : 'Enable'} {twoFactorAuth && '✓'}
            </button>
          </div>
        </div>
      </div>

      {/* Save button at the bottom center */}
      <button className={`save-button ${unsavedChanges ? 'green' : 'grey'}`} onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
}

export default Settings;
