import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';

function PayCreditCard() {
    const [accounts, setAccounts] = useState([]);
    const [creditCards, setCreditCards] = useState([]);
    const [fromAccount, setFromAccount] = useState('');
    const [selectedCard, setSelectedCard] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadAccounts();
        loadCreditCards();
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

    const loadCreditCards = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/credit-card', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCreditCards(res.data.credit_cards);
            if (res.data.credit_cards.length) {
                setSelectedCard(res.data.credit_cards[0].number);
            }
        } catch (err) {
            setError('Failed to load credit cards!');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!fromAccount || !amount || !selectedCard) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        if (amount <= 0) {
            setError('Payment amount must be greater than zero.');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/api/credit-card/pay-credit-card',
                { 
                    from_account: fromAccount,
                    card_number: selectedCard,
                    amount: parseFloat(amount)
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess(response.data.message);
            setAmount('');
            loadAccounts();
            loadCreditCards();
        } catch (err) {
            setError(err.response?.data?.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Credit Card Debt Payment</h2>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit}>

                <div className="form-control">
                    <label className="form-label">
                        Credit Card:
                    </label>
                    <select 
                        className="form-select"
                        value={selectedCard}
                        onChange={(e) => setSelectedCard(e.target.value)}
                    >
                        {creditCards.map(card => (
                            <option key={card.number} value={card.number}>
                                {card.type} - **** **** **** {card.number.slice(-4)} (Debt: {card.debt} {card.currency})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-control">
                    <label className="form-label">
                        Account to Pay From:
                    </label>
                    <select 
                        className="form-select"
                        value={fromAccount}
                        onChange={(e) => setFromAccount(e.target.value)}
                    >
                        {accounts.map(acc => (
                            <option key={acc.account_id} value={acc.account_id}>
                                {acc.account_id} - {acc.type} ({acc.amount} {acc.currency})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-control">
                    <label className="form-label">Payment Amount:</label>
                    <input
                        type="number"
                        className="form-input"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                    />
                </div>

                <div className="button-group">
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Payment is processing...' : 'Pay the Debt'}
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

export default PayCreditCard;