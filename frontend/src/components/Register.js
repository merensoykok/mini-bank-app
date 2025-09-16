import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiEndpoints } from '../config/api';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                //'http://localhost:5000/api/user/register'
                apiEndpoints.register,
                { username, password }
            );
            navigate('/login');
        } catch (err) {
            //alert(err.response.data.message);
            console.error(err);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <h2>Register Page</h2>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Register</button>
        </form>
    );
}


export default Register;