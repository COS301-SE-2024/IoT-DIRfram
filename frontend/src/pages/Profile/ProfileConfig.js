export const getUserProfile = (sessionId) => {
    return fetch(`${process.env.REACT_APP_API_URL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionId}`,
      },
    })
      .then(response => response.json())
      .catch(err => {
        console.error('Error fetching profile:', err);
        throw err;
      });
  };
  