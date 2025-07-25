import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';


export default function MoneyTransfer() {
    const [accounts, setAccounts] = useState([]);
    const [fromAccount, setFromAccount] = useState('');
    const [toAccount, setToAccount] = useState('');
    const [selectedAccountDetails, setSelectedAccountDetails] = useState(null);

    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadAccounts();
    }, []);

    const loadAccounts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/account', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAccounts(res.data.accounts);
            if (res.data.accounts.length) {
                setFromAccount(res.data.accounts[0].account_id);
            }
        } catch (err) {
            setError('Failed to load accounts!');
        }
    };

    useEffect(() => {
        if (fromAccount && accounts.length > 0) {
            const selected = accounts.find(acc => acc.account_id === fromAccount);
            setSelectedAccountDetails(selected);
        }
    }, [fromAccount, accounts]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Validation
        if (!fromAccount || !toAccount || !amount) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        if (fromAccount === toAccount) {
            setError('Sender and receiver accounts cannot be the same.');
            setLoading(false);
            return;
        }

        if (amount <= 0) {
            setError('Amount must be greater than zero.');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                'http://localhost:5000/api/account/money-transfer',
                { 
                    from_account: fromAccount, 
                    to_account: toAccount, 
                    amount: parseFloat(amount) 
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess( res.data.message || 'Transfer successful!');
            setAmount('');
            setToAccount(''); 
            loadAccounts()
            /* navigate('/dashboard'); */
        } catch (err) {
            setError(err.response?.data?.message || 'Transfer failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="transfer-container">
            <h2 className="transfer-title">Money Transfer</h2>
            
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
                    <label className="form-label">Sender Account ID:</label>
                    <select 
                        data-testid="from-account-select"
                        className="form-select"
                        value={fromAccount}
                        onChange={(e) => setFromAccount(e.target.value)}
                    >
                        {accounts.map(acc => (
                            <option key={acc.account_id} value={acc.account_id}>
                                {acc.name} - {acc.account_id}
                            </option>
                        ))}
                    </select>

                    {selectedAccountDetails && (
                        <div className="account-details">
                            <p className="account-balance">
                                <span>{selectedAccountDetails.amount} {selectedAccountDetails.currency} Available</span>
                            </p>
                        </div>
                    )}

                </div>

                <div className="form-control">
                    <label className="form-label">
                        Receiver Account ID:
                    </label>
                    <input
                        data-testid="to-account-input"
                        className="form-input"
                        value={toAccount}
                        onChange={(e) => setToAccount(e.target.value)}
                        placeholder="Enter the receiver account ID"
                        type="text"
                    />
                </div>

                <div className="form-control">
                    <label className="form-label">Amount:</label>
                    <input
                        className="form-input"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                    />
                    {selectedAccountDetails && (
                        <p className="text-sm text-gray-600">
                            Currency: {selectedAccountDetails.currency}
                        </p>
                    )}
                </div>

                <div className="button-group">
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Transfer is processing...' : 'Make Transaction'}
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