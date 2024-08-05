import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import Cookies from 'js-cookie';
import { getUserProfile } from './ProfileConfig'; // Ensure this function fetches data from your API
import './Profile.css';
import Header from '../../components/Header/Header';
import defaultAvatar from '../../assets/profile1.jpg';

function Profile() {
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: ''
  });

  useEffect(() => {
    const username = Cookies.get('username');
    if (username) {
      getUserProfile(username)
        .then(data => {
          setUserDetails(data);
        })
        .catch(err => {
          console.error('Error fetching profile:', err);
          // Fallback to data stored in cookies if API fails
          setUserDetails({
            username: username || 'Guest',
            email: Cookies.get('email') || 'No email available'
          });
        });
    }
  }, []);

  return (
    <div>
      <Header />
      <h1 style={{ textAlign: 'center' }}>Profile</h1>
      <div className="profile-container">
        <div className="profile-details">
          <div className="avatar-container">
            <img src={defaultAvatar} alt="Avatar" className="avatar" />
          </div>
          <p><strong>Username:</strong> {userDetails.username}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
        </div>
        <Link to="/edit-profile">
          <button className="edit-profile-button">Edit Profile</button>
        </Link>
      </div>
    </div>
  );
}

export default Profile;
