import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/LoginInput.css';

function Login({ onLogin }) {
    const navigate = useNavigate();

    // Handle form submission
    // This function is called when the user submits the login form.
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');
        
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username: email,
                password: password
            });
            console.log('Login successful:', response.data);
        
            const { user } = response.data;
            if (user && user.id) {
                localStorage.setItem('userId', user.id);
                alert('Login successful!');
                onLogin();
                navigate('/dashboard');
            } else {
                alert('Invalid login response from server.');
            }
        } catch (error) {
            console.error('Error logging in:', error.message);
            alert('Invalid username or password.');
        }
    };
    
    return (
        <div className='titles'>
            <div className="titleandimage">
                <h1>TsundokuBR</h1>
                <div className="logo"></div>
            </div>
           <h2>Login</h2>

            {/* Login Form */}
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
                <div className="button-container">
                    <button type="submit">Login</button>
                </div>
            </form>
            <br />
            {/* Create Account Button */}
            <Link to="/createaccount" className="button">Create Account</Link>
        </div>
    );
}
export default Login;