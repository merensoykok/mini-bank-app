import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';
import { apiEndpoints } from '../config/api';


export default function CreateAccount() {
    const [type, setType] = useState('checking');
    const [currency, setCurrency] = useState('USD');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
		setSuccess('');
        setLoading(true);

        if (!name.trim()) {
            setError('Account name is required');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                //'http://localhost:5000/api/account/create',
                apiEndpoints.createAccount,
                { type, currency, name },
                { headers: { Authorization: `Bearer ${token}` } }
            );
			setSuccess(res.data.message || 'create account successfully');
            setLoading(false);
            setName('');
            //navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Account creation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Create New Account</h2>
            
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

			{success && (
                <div className="success-message">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-control">
                    <label className="form-label">Account Type:</label>
                    <select 
                        className="form-select"
                        value={type}
                        onChange={e => setType(e.target.value)}
                    >
                        <option value="checking">Checking Account</option>
                        <option value="savings">Saving Account</option>
                    </select>
                </div>

                <div className="form-control">
                    <label className="form-label">Currency Type:</label>
                    <select 
                        className="form-select"
                        value={currency}
                        onChange={e => setCurrency(e.target.value)}
                    >
                        <option value="USD">Dolar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                        <option value="TRY">Turkish Lira (TRY)</option>
                    </select>
                </div>

                <div className="form-control">
                    <label className="form-label">Account Name:</label>
                    <input
                        type="text"
                        className="form-input"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Holding Account, Emergency Fund, etc."
                    />
                </div>

                <div className="button-group">
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Account'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="btn btn-secondary"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}