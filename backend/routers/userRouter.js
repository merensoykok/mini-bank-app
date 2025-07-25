const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const { readJson, writeJson } = require('../utils/jsonHelper');
const { generateId } = require('../utils/IDGenerator');

const router = express.Router();
const USERS_FILE = 'data/users.json';
const ACCOUNTS_FILE = 'data/accounts.json';
const JWT_SECRET = 'secretkey';

// Helper to generate a 12-digit timestamp ID with prefix


// Register user and create default account
router.post('/register', async (req, res) => {

    try{
        const { username, password } = req.body;
        const users = await readJson(USERS_FILE);
        if (users.find(u => u.username === username)) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const hashed = await bcrypt.hash(password, 10);
        const newUserId = generateId('user');
        const newUser = { user_id: newUserId, username: username, password: hashed, account_ids: [] };
        users.push(newUser);

        await writeJson(USERS_FILE, users);
        return res.json({ message: 'Registration successful' });

    } catch (error) {
        console.error('Error in registration:', error);
        return res.status(400).json({ message: 'Registration failed' });
    }

  

    /*
    // Create default account
    const accounts = await readJson(ACCOUNTS_FILE);
    const newAccountId = accounts.length ? Math.max(...accounts.map(a => a.account_id)) + 1 : 1;
    const newAccount = {
        account_id: newAccountId,
        user_id: newUserId,
        type: 'checking',
        currency: 'USD',
        amount: 1000
    };
    accounts.push(newAccount);

    // Link account to user and persist both
    newUser.account_ids.push(newAccountId);
    await writeJson(USERS_FILE, users);
    await writeJson(ACCOUNTS_FILE, accounts);
    */

});



// Login user
router.post('/login', async (req, res) => {
    try{
        const { username, password } = req.body;
        const users = await readJson(USERS_FILE);
        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        
        const token = jwt.sign({ user_id: user.user_id, username: user.username }, JWT_SECRET);
        return res.status(200).json({ token });
    } catch (error) {
        console.error('Error in login:', error);
        return res.status(400).json({ message: 'Login failed' });
    }

    
});

module.exports = router;