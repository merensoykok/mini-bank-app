const express = require('express');
const jwt = require('jsonwebtoken');
const { readJson, writeJson } = require('../utils/jsonHelper');

const router = express.Router();
const CREDIT_CARDS_FILE = 'data/creditCard.json';
const ACCOUNTS_FILE = 'data/accounts.json';
const JWT_SECRET = 'secretkey';

router.get('/', async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: 'No token provided' });

    try {
        const { user_id } = jwt.verify(auth.split(' ')[1], JWT_SECRET);
        const creditCards = await readJson(CREDIT_CARDS_FILE);
        const userCards = creditCards.filter(card => card.user_id === user_id);
        
        res.json({ credit_cards: userCards });
    } catch (error) {
        res.status(500).json({ message: 'Failed to load credit cards' });
    }
});

router.post('/pay-credit-card', async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: 'No token provided' });

    try {
        const { user_id } = jwt.verify(auth.split(' ')[1], JWT_SECRET);
        const { from_account, card_number, amount } = req.body;

        const creditCards = await readJson(CREDIT_CARDS_FILE);
        const accountsData = await readJson(ACCOUNTS_FILE);

        const creditCard = creditCards.find(card => 
            card.number === card_number && card.user_id === user_id
        );

        if (!creditCard) {
            return res.status(404).json({ message: 'Credit card does not exist' });
        }

        const sourceAccount = accountsData.find(acc => 
            acc.account_id === from_account && acc.user_id === user_id
        );

        if (!sourceAccount) {
            return res.status(404).json({ message: 'Account does not exist.' });
        }

        if (amount <= 0 || amount > creditCard.debt) {
            return res.status(400).json({ 
                message: 'Invalid amount.' 
            });
        }

        if (amount < creditCard.debt * creditCard.minimum_payment_rate) {
            return res.status(400).json({ 
                message: `Amount must be more than ${(creditCard.debt * creditCard.minimum_payment_rate).toFixed(2)} ${sourceAccount.currency}.` 
            });
        }

        if (sourceAccount.amount < amount) {
            return res.status(400).json({ message: 'Invalid amount for selected account.' });
        }

        sourceAccount.amount -= parseFloat(amount);
        creditCard.debt -= parseFloat(amount);

        await writeJson(ACCOUNTS_FILE, accountsData);
        await writeJson(CREDIT_CARDS_FILE, creditCards);

        res.json({ 
            message: `${amount} ${sourceAccount.currency} amount is payed successfully.`,
            new_amount: sourceAccount.amount,
            remaining_debt: creditCard.debt
        });

    } catch (error) {
        res.status(401).json({ message: 'Auth failed' });
    }
});

module.exports = router;