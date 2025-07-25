const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');

const { readJson, writeJson } = require('../utils/jsonHelper');
const { generateId } = require('../utils/IDGenerator');

const router = express.Router();

const USERS_FILE = 'data/users.json';
const ACCOUNTS_FILE = 'data/accounts.json';
const JWT_SECRET = 'secretkey';

// Get accounts for logged-in user
router.get('/', async (req, res) => {
    const auth = req.headers.authorization;

    if (!auth) 
        return res.status(401).json({ message: 'No token provided' });

    const token = auth.split(' ')[1];

    try {
        const { user_id, username } = jwt.verify(token, JWT_SECRET);
        const accounts = await readJson(ACCOUNTS_FILE);
        const userAccounts = accounts.filter(a => a.user_id === user_id);

        return res.json({ accounts: userAccounts, username: username });
    } 
    catch {
        return res.status(401).json({ message: 'Invalid token' });
    }
});

router.post('/create', async (req, res) => {
    const auth = req.headers.authorization;

    if (!auth) 
        return res.status(401).json({ message: 'No token provided' });

    const token = auth.split(' ')[1];

    try {
        const { user_id } = jwt.verify(token, JWT_SECRET);
        const accounts = await readJson(ACCOUNTS_FILE);

        const { type, currency,name } = req.body;

        const newAccountId = generateId('acc');

        const newAccount = {
            account_id: newAccountId,
            user_id: user_id,
            type: type,
            currency: currency,
            name: name,
            amount: 0
        };

        accounts.push(newAccount);
        await writeJson(ACCOUNTS_FILE, accounts);

        const users = await readJson(USERS_FILE);
        const user = users.find(u => u.user_id === user_id);
        if (user) {
            user.account_ids.push(newAccountId);
            await writeJson(USERS_FILE, users);
        }

        return res.json({ message: 'Account created successfully.', account: newAccount });
    } 
    catch (error) {
        console.error('Error creating account:', error);
        return res.status(400).json({ message: 'Failed to create account' });
    }
});

router.delete('/delete', async (req, res) => {
    const auth = req.headers.authorization;

    if (!auth) 
        return res.status(401).json({ message: 'No token provided' });

    const token = auth.split(' ')[1];

    try {
        const { user_id } = jwt.verify(token, JWT_SECRET);
        const accounts = await readJson(ACCOUNTS_FILE);
        const users = await readJson(USERS_FILE);
        console.log('Request data:', req.body);
        const { account_id } = req.body;

        // Find and remove the account
        const accountIndex = accounts.findIndex(a => a.account_id === account_id && a.user_id === user_id);
        if (accountIndex === -1) {
            return res.status(404).json({ message: 'Account not found' });
        }

        const deletedAccount = accounts.splice(accountIndex, 1)[0];
        await writeJson(ACCOUNTS_FILE, accounts);

        // Remove the account from the user's account_ids
        const user = users.find(u => u.user_id === user_id);
        if (user) {
            user.account_ids = user.account_ids.filter(id => id !== account_id);
            await writeJson(USERS_FILE, users);
        }

        return res.json({ message: 'Account deleted successfully', account: deletedAccount });
    } 
    catch (error) {
        console.error('Error deleting account:', error);
        return res.status(400).json({ message: 'Failed to delete account' });
    }
});



router.post('/money-transfer', async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth) 
        return res.status(401).json({ message: 'No token provided' });
    try {
        const { user_id } = jwt.verify(auth.split(' ')[1], JWT_SECRET);
        const { from_account, to_account, amount } = req.body;
        const amt = parseFloat(amount);
        if (amt <= 0) return res.status(400).json({ message: 'Invalid amount' });

        const accounts = await readJson(ACCOUNTS_FILE);
        const fromAcc = accounts.find(a => a.account_id === from_account && a.user_id === user_id);
        const toAcc = accounts.find(a => a.account_id === to_account);
        
        if (!fromAcc) 
            return res.status(404).json({ message: 'Sender Account Not Found' });
        if (!toAcc) 
            return res.status(404).json({ message: 'Receiver Account Not Found' });
        if (fromAcc.currency !== toAcc.currency)
            return res.status(400).json({ message: 'Sender and Receiver accounts must have the same currency' });
        if (fromAcc.amount < amt) 
            return res.status(400).json({ message: 'Insufficient Amount' });

        fromAcc.amount -= amt;
        toAcc.amount += amt;
        await writeJson(ACCOUNTS_FILE, accounts);

        res.json({ message: 'Transfer Successful' });
    } catch {
        res.status(401).json({ message: 'Auth failed' });
    }
});

module.exports = router;