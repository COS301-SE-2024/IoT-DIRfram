import React, { useState } from 'react';
// import './Modal.css';

const Modal = ({ show, handleClose, handleSave, deviceName }) => {
  const [inputValue, setInputValue] = useState(deviceName);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSaveClick = () => {
    handleSave(inputValue); // Call the save function passed as a prop
    handleClose(); // Close the modal after saving
  };

  if (!show) {
    return null; // Do not render the modal if not needed
  }

  return (
    <div className="modal-overlay-app">
      <div className="modal-content-app">
        <button className="close" onClick={handleClose}>✖</button>
        <h2>Edit Device Name</h2>
        <input
          type="text"
          placeholder="Enter new device name"
          value={inputValue}
          onChange={handleInputChange}
        />
        <div className="modal-actions">
          <button onClick={handleSaveClick}>Save</button>
          <button onClick={handleClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
