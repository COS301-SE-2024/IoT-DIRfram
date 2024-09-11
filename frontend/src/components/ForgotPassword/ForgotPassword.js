import React, { useState } from 'react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleForgotPassword = (e) => {
        e.preventDefault();
        console.log(email);
        fetch(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    setMessage(data.message);
                    setError('');
                } else if (data.error) {
                    setError(data.error);
                }
            })
            .catch(err => setError('An error occurred.'));
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Forgot Password</h2>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleForgotPassword}>
                    <div className="form-group">
                        <label htmlFor="email">Enter your email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit">Send Reset Link</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
