import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

function Profile() {
  const [userDetails, setUserDetails] = useState({ username: '', surname: '', email: '' });

  useEffect(() => {
    // Fetch user details from the server or use stored information from cookies/local storage
    const sessionId = Cookies.get('session');
    if (sessionId) {
      fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionId}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          setUserDetails(data);
        })
        .catch(err => {
          console.error('Error fetching profile:', err);
        });
    }
  }, []);

  return (
    <div>
      <h1>Profile</h1>
      <p><strong>Username:</strong> {userDetails.username}</p>
      <p><strong>Surname:</strong> {userDetails.surname}</p>
      <p><strong>Email:</strong> {userDetails.email}</p>
    </div>
  );
}

export default Profile;
