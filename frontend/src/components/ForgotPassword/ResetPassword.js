import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Get the token from the URL
    const query = new URLSearchParams(useLocation().search);
    const token = query.get('token');

    const handleResetPassword = (e) => {
        e.preventDefault();
        //console.log(token);
        fetch(`${process.env.REACT_APP_API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, newPassword, confirmNewPassword }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    setMessage(data.message);
                    toast.success(data.message, {
                        position: 'top-center',
                        onClose: () => navigate('/login'),
                    });
                    setError('');
                } else if (data.error) {
                    setError(data.error);
                    toast.error(data.error);
                }
            })
            .catch(err => setError('An error occurred.'));
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Reset Password</h2>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleResetPassword}>
                    <div className="form-group">
                        <label htmlFor="newPassword">New Password:</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="confirmNewPassword">Confirm New Password:</label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Reset Password</button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ResetPassword;
