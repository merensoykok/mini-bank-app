import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';
import { apiEndpoints } from '../config/api';

function Login({setToken}) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setError('');
        
        if (!username || !password) {
            setError('Please fill in all fields.');
            return;
        }

        try{
            const res = await axios.post(
                //'http://localhost:5000/api/user/login', 
                apiEndpoints.login,
                { username, password }
            );
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            navigate('/dashboard');
            
        } catch (err){
            setError(err.response?.data?.message || 'Login is failed. Please try again.');
        }
    }

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2 className="form-title">Login</h2>
                <div className="form-group">
                    <input 
                        className="input-field"
                        placeholder="Nickname"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input 
                        className="input-field"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button className="btn btn-primary" type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login