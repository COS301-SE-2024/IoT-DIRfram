import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css'; // Import CSS file for styling

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      setLoggedIn(true);
    } else {
      alert('Please enter username and password');
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
