import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Login.css'; // Import CSS file for styling

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Invalid credentials');
        })
        .then(data => {
          setLoggedIn(true);
          setError('');
          Cookies.set('session', data.sessionId, { expires: 1 }); //1 day cookie session
          navigate('/dashboard'); 
        })
        .catch(err => {
          setError(err.message);
        });
    } else {
      setError('Please enter username and password');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        {loggedIn ? (
          <div>
            <h2>Welcome, {username}!</h2>
            <button className="btn-logout" onClick={() => setLoggedIn(false)}>Logout</button>
          </div>
        ) : (
          <form onSubmit={handleLogin}>
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-submit">Login</button>
          </form>
        )}
        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  );
};

export default Login;
