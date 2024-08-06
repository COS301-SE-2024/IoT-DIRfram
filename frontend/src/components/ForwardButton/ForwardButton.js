import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ForwardButton.css';

const ForwardButton = () => {
  const navigate = useNavigate();

  const handleForwardClick = () => {
    navigate(1); // Go forward in the history
  };

  return (
    <button className="forward-button" onClick={handleForwardClick}>
      →
      <span className="forward-text">Forward</span>
    </button>
  );
};

export default ForwardButton;