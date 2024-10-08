import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing icons for password visibility
import './Login.css'; // Import CSS file for styling

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  useEffect(() => {
    if (Cookies.get('session')) {
      navigate('/dashboard');
    }
  }, [navigate]);

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
        Cookies.set('session', data.sessionId, { expires: 1 }); // Set session cookie for 1 day
        Cookies.set('username', username, { expires: 1 }); // Set session cookie for 1 day
        navigate('/dashboard'); // Redirect to dashboard
      })
      .catch(err => {
        setError(err.message);
      });
    } else {
      setError('Please enter username and password');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
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
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'} // Conditionally change input type
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="toggle-password" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Toggle icon */}
              </span>
            </div>
          </div>
          <button type="submit" className="btn-submit">Login</button>
        </form>
        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        <Link to="/forgot-password">Forgot password?</Link>
      </div>
    </div>
  );
};

export default Login;
