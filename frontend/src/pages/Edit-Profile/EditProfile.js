import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EditProfile.css';
import Header from '../../components/Header/Header';
import defaultAvatar from '../../assets/profile.jpg'; 

function EditProfile() {
  const [userDetails, setUserDetails] = useState({
    username: Cookies.get('username') || '',
    surname: Cookies.get('surname') || '',
    email: Cookies.get('email') || ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call an API to update the user details
    console.log('Updated Details:', userDetails);
    
    toast.success('Changes saved', {
      position: "top-center", // Use string directly for position
      onClose: () => navigate('/dashboard') // Redirect to the dashboard after closing the toast
    });
  };

  return (
    <div>
      <Header />
      <h1 style={{ textAlign: 'center' }}>Edit Profile</h1>
      <div className="profile-container">
      <div className="avatar-container">
            <img src={defaultAvatar} alt="Avatar" className="avatar" />
          </div>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={userDetails.username} onChange={handleChange} />
        </label>
        <label>
          Surname:
          <input type="text" name="surname" value={userDetails.surname} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={userDetails.email} onChange={handleChange} />
        </label>
        <button type="submit" className="save-button">Save</button>
      </form>
      <ToastContainer />
    </div></div>
  );
}

export default EditProfile;
