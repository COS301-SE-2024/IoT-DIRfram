// FloatingIcon.js
import './help.css'; // Import your CSS file
import React, { useState } from 'react';
import Modal from './Modal'; // Assuming you have a Modal component

const FloatingIcon = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div>
      <div className="floating-icon" onClick={toggleModal}>
        {/* Icon */}
        <span role="img" aria-label="Info">
          ℹ️
        </span>
      </div>
      {showModal && <Modal onClose={toggleModal} />}
    </div>
  );
};

export default FloatingIcon;
