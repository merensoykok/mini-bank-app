import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import CreateAccount from './CreateAccount';
import '../styles/global.css';

export default function Dashboard() {
    const [accounts, setAccounts] = useState([]);
    const [username, setUsername] = useState('');
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAccounts();
    }, []); 

    const fetchAccounts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/account', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAccounts(res.data.accounts);
            setUsername(res.data.username);        } catch (err) {
            alert('Session expired');
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    const handleDeleteAccount = async (accountId) => {
        const token = localStorage.getItem('token');
        const res = await axios.delete('http://localhost:5000/api/account/delete', 
            {
                data: { account_id: accountId } ,
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        fetchAccounts();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const totalamount
     = accounts.reduce((sum, acc) => sum + (acc.amount
         || 0), 0);

    // Placeholder for credit cards
    const creditCards = [1, 2, 3];

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="text-2xl font-bold">Welcome, {username}</h1>
                    <p className="text-gray-600">Account Summary</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="action-button bg-red-500 hover:bg-red-600 text-white"
                >
                    Log Out
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Hesaplar Bölümü */}
                <div className="bg-white rounded-lg shadow p-6">
                    
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">My Accounts</h2>
                        <button
                            onClick={() => navigate('/create-account')}
                            className="action-button bg-green-500 hover:bg-green-600 text-white"
                        >
                            Create New Account
                        </button>
                    </div>
                    <div className="accounts-section">
                    {accounts.map((acc, idx) => (
                        <div key={idx} className="account-card">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 
                                        className="font-semibold text-lg" 
                                        itemprop="name"
                                    >
                                        {acc.name}
                                    </h3>
                                    <p 
                                        className="text-gray-600" 
                                        itemprop="identifier"
                                    >
                                        Hesap No: {acc.account_id}
                                    </p>
                                    <p 
                                        className="mt-2 text-xl font-bold" 
                                        itemprop="amount"
                                        content={acc.amount
                                            
                                        }
                                    >
                                        <span itemprop="currency">{acc.currency}</span> {acc.amount
                                        }
                                    </p>
                                </div>
                                <button 
                                    onClick={() => handleDeleteAccount(acc.account_id)}
                                    className="delete-button"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>

                <div className="amount
                -card">
                    <h2 className="text-xl font-bold mb-4">Total amount
                        
                    </h2>
                    <p className="text-3xl font-bold">{totalamount
                        } USD</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Fast Process</h2>
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/money-transfer')}
                            className="action-button bg-blue-500 hover:bg-blue-600 text-white w-full"
                        >
                            Money Transfer
                        </button>
                        <button 
                            onClick={() => navigate('/pay-credit-card')}                        
                            className="action-button bg-purple-500 hover:bg-purple-600 text-white w-full"
                        >
                            Pay Credit Card Debit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}