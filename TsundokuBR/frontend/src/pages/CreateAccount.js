import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/LoginInput.css';

function CreateAccount({ onAccountCreated }) {
    const navigate = useNavigate();

    // Handle form submission
    // This function is called when the user submits the form to create an account.
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        // Validate passwords match
        // This checks if the password and confirm password fields match.
        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/create-account', {
                username: email,
                password: password
            });
            console.log('Account created:', response.data);
            onAccountCreated(response.data.user);
            navigate('/');
        } catch (error) {
            console.error('Error creating account:', error.message);
        }
    };

    return (
        <div className='titles'>
            <div className="titleandimage">
                <h1>TsundokuBR</h1>
                <div className="logo"></div>
            </div>
            <h2>Create Account</h2>
            {/* Account Creation Form */}
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input type="email" name="email" required />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" name="password" required />
                </label>
                <br />
                <label>
                    Confirm Password:
                    <input type="password" name="confirmPassword" required />
                </label>
                <div className="button-container">
                    <button type="submit">Create Account</button>
                </div>
            </form>
            <br />
            {/* Login Button */}
            <Link to="/" className="button">Back to Login</Link>
        </div>
    );
}

export default CreateAccount;
