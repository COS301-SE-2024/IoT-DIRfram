import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing icons for password visibility
import 'react-toastify/dist/ReactToastify.css';
import './EditProfile.css';
import Header from '../../components/Header/Header';
import defaultAvatar from '../../assets/profile1.jpg'; 

function EditProfile() {
  const [userDetails, setUserDetails] = useState({
    username: Cookies.get('username') || '',
    password: '',
    confirmPassword: '',
    email: Cookies.get('email') || '',
    name: Cookies.get('name') || '',
    surname: Cookies.get('surname') || '',
    age: Cookies.get('age') || '',
  });

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userDetails.password !== userDetails.confirmPassword) {
      toast.error('Passwords do not match', {
        position: 'top-center',
      });
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/updateUserDetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentUsername: Cookies.get('username'),
          newUsername: userDetails.username,
          newEmail: userDetails.email,
          newPassword: userDetails.password,
          confirmNewPassword: userDetails.confirmPassword,
          name: userDetails.name,
          surname: userDetails.surname,
          age: userDetails.age,
        }),
      });

      console.log('Update profile response:', response);

      if (response.ok) {
        const data = await response.json();
        console.log('Update profile data:', data);
        // Save updated details in cookies
        Cookies.set('username', userDetails.username, { expires: 7 });
        Cookies.set('email', userDetails.email, { expires: 7 });
        Cookies.set('name', userDetails.name, { expires: 7 });
        Cookies.set('surname', userDetails.surname, { expires: 7 });
        Cookies.set('age', userDetails.age, { expires: 7 });

        toast.success('Changes saved', {
          position: 'top-center',
          onClose: () => navigate('/profile'),
        });
      } else {
        const errorData = await response.json();
        toast.error(`Failed to save changes: ${errorData.message}`, {
          position: 'top-center',
        });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('An error occurred. Please try again later.', {
        position: 'top-center',
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleClose = () => {
    navigate('/profile');
  };

  return (
    <div>
      <Header />
      <h1 style={{ textAlign: 'center' }}>Edit Profile</h1>
      <div className="profile-container">
        <div className="avatar-container">
          <img src={defaultAvatar} alt="Avatar" className="avatar" />
        </div>
        <form className="edit-profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Username:
            <input type="text" name="username" value={userDetails.username} onChange={handleChange} />
          </label>
          <label>
            Change Password:
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={userDetails.password}
                onChange={handleChange}
              />
              <span className="toggle-password" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </label>
        </div>
        <div className="form-group">
          <label>
            Email:
            <input type="email" name="email" value={userDetails.email} onChange={handleChange} />
          </label>
          <label>
            Confirm Password:
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={userDetails.confirmPassword}
                onChange={handleChange}
              />
              <span className="toggle-password" onClick={toggleConfirmPasswordVisibility}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </label>
        </div>
        <div className="form-group">
          <label>
            Name (optional):
            <input type="text" name="name" value={userDetails.name} onChange={handleChange} />
          </label>
          <label>
            Age (optional):
            <input type="number" name="age" value={userDetails.age} onChange={handleChange} />
          </label>
        </div>
        <div className="form-group">
        <label>
            Surname (optional):
            <input type="text" name="surname" value={userDetails.surname} onChange={handleChange} />
          </label>
        </div>
        <div className="button-container">
          <button type="submit" className="save-button">Save</button>
          <button type="button" className="remove-button" onClick={handleClose}>Close</button>
        </div>
      </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default EditProfile;
