const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const userRouter = require('./routers/userRouter');
const accountRouter = require('./routers/accountRouter');
const creditCardRouter = require('./routers/creditCardRouter');
const { checkDataFile } = require('./utils/jsonHelper');

const app = express();

// Allow localhost during development and FRONTEND_URL (set in Vercel) in production
const allowedOrigins = [
	'http://localhost:3000',
	process.env.FRONTEND_URL // e.g. https://your-frontend.vercel.app
].filter(Boolean);

app.use(cors({
	origin: (origin, cb) => {
		if (!origin) return cb(null, true); // server-to-server or same-origin
		if (allowedOrigins.includes(origin)) return cb(null, true);
		return cb(new Error('CORS not allowed for this origin')); 
	},
	credentials: true
}));

app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/account', accountRouter);
app.use('/api/credit-card', creditCardRouter);

// Initialize data files (note: on Vercel these reset each deployment; not persistent)
checkDataFile('data/users.json');
checkDataFile('data/accounts.json');
checkDataFile('data/creditCard.json');

// Local development listener
if (require.main === module) {
	const PORT = process.env.PORT || 5000;
	app.listen(PORT, () => {
		console.log(`Server running on http://localhost:${PORT}`);
	});
}

// Export for Vercel serverless
module.exports = app;
