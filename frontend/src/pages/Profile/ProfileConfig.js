export const getUserProfile = (username) => {
  return fetch(`${process.env.REACT_APP_API_URL}/auth/getUserData`, {
    method: 'POST', // Change to POST
    headers: {
      'Content-Type': 'application/json',
      // You can include Authorization header if needed
      // 'Authorization': `Bearer ${sessionId}`,
    },
    body: JSON.stringify({ username }), // Send username in the body
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // console.log('getUserProfile response:', response);
      return response.json();
    })
    .catch(err => {
      // console.error('Error fetching profile:', err);
      throw err;
    });
};
