import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { getUserProfile } from './ProfileConfig';
import './Profile.css';
import Header from '../../components/Header/Header';
import defaultAvatar from '../../assets/profile.jpg';

function Profile() {
  const [userDetails, setUserDetails] = useState({ username: 'John', surname: 'Doe', email: 'john.doe@gmail.com' });

  useEffect(() => {
    const sessionId = Cookies.get('session');
    if (sessionId) {
      getUserProfile(sessionId)
        .then(data => {
          setUserDetails(data);
        })
        .catch(err => {
          console.error('Error fetching profile:', err);
        });
    }
  }, []);

  // Get login details from cookies
  const loggedInUsername = Cookies.get('username');
  const loggedInEmail = Cookies.get('email');
  const loggedInSurname = Cookies.get('surname');

  return (
    <div>
      <Header />
      <h1 style={{ textAlign: 'center' }}>Profile</h1>
      <div className="profile-container">
        <div className="profile-details">
          <div className="avatar-container">
            <img src={defaultAvatar} alt="Avatar" className="avatar" />
          </div>
          <p><strong>Username:</strong> {userDetails.username || loggedInUsername}</p>
          <p><strong>Surname:</strong> {userDetails.surname || loggedInSurname}</p>
          <p><strong>Email:</strong> {userDetails.email || loggedInEmail}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
