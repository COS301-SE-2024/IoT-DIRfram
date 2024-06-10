import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css'; // Import CSS file for styling

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Here you can add your login logic, like calling an API to authenticate user
    // For simplicity, I'll just check if username and password are not empty
    if (username && password) {
      setLoggedIn(true);
      // You can also add redirection logic here after successful login
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
            <button onClick={() => setLoggedIn(false)}>Logout</button>
          </div>
        ) : (
          <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <div>
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Login</button>
          </form>
        )}
        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  );
};

export default Login;
