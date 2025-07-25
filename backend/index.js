	const express = require('express');
	const cors = require('cors');
	const fs = require('fs-extra');
	const path = require('path');

	const userRouter = require('./routers/userRouter');
	const accountRouter = require('./routers/accountRouter');
	const creditCardRouter = require('./routers/creditCardRouter');
	const { checkDataFile } = require('./utils/jsonHelper');

	const app = express();

	app.use(cors({
		origin: 'http://localhost:3000',
		credentials: true
	}));

	app.use(express.json());
	//app.use(cookieParser());

	app.use('/api/user', userRouter);
	app.use('/api/account', accountRouter);
	app.use('/api/credit-card', creditCardRouter);


	const PORT = 5000;

	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
		console.log(`Visit http://localhost:${PORT} to see the app.`);
		console.log(`Press Ctrl+C to stop the server.`);
		console.log(`To run the app, use the command: node index.js`);

		checkDataFile('data/users.json');
		checkDataFile('data/accounts.json');
		checkDataFile('data/creditCard.json');

	});
