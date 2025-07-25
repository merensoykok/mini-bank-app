import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CreateAccount from './components/CreateAccount';
import MoneyTransfer from './components/MoneyTransfer';
import PayCreditCard from './components/PayCreditCard';
import './styles/global.css';


function App() {

    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem('token'));
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <Router>
            <Routes>
                <Route path='/' element={<Navigate to={token ? "/dashboard" : "/login"} />} />
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login setToken={setToken} />} />
                <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/create-account" element={token ? <CreateAccount /> : <Navigate to="/login" />} />
                <Route path="/money-transfer" element={token ? <MoneyTransfer /> : <Navigate to="/login" />} />
                <Route path="/pay-credit-card" element={token ? <PayCreditCard /> : <Navigate to="/login" />} />
                <Route path="/*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
            </Routes>
        </Router>
    );
}

export default App;