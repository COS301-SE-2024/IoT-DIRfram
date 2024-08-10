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
    email: '',
    name: '',
    surname: '',
    age: ''
  });

  useEffect(() => {
    const username = Cookies.get('username');
    if (username) {
      getUserProfile(username)
        .then(data => {
          setUserDetails(data);

          // Store user details in cookies
          Cookies.set('username', data.username, { expires: 7 });
          Cookies.set('email', data.email, { expires: 7 });
          Cookies.set('name', data.name, { expires: 7 });
          Cookies.set('surname', data.surname, { expires: 7 });
          Cookies.set('age', data.age, { expires: 7 });
        })
        .catch(err => {
          console.error('Error fetching profile:', err);

          // Fallback to data stored in cookies if API fails
          setUserDetails({
            username: username || 'Guest',
            email: Cookies.get('email') || 'No email available',
            name: Cookies.get('name') || 'No name available',
            surname: Cookies.get('surname') || 'No surname available',
            age: Cookies.get('age') || 'No age available',
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
          <p><strong>Name:</strong> {userDetails.name}</p>
          <p><strong>Surname:</strong> {userDetails.surname}</p>
          <p><strong>Age:</strong> {userDetails.age}</p>
        </div>
        <Link to="/edit-profile">
          <button className="edit-profile-button">Edit Profile</button>
        </Link>
      </div>
    </div>
  );
}

export default Profile;
