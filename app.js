const express = require('express');
const axios = require('axios').default;
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 60,
});

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());
app.use(limiter);

const allowedActions = ['account_history', 'account_info', 'accounts_frontiers', 'accounts_balances', 'accounts_pending', 'block', 'blocks', 'block_count', 'blocks_info', 'bootstrap_status', 'delegators_count', 'pending', 'process', 'representatives_online', 'validate_account_number'];

app.all('/', async (req, res) => {
	console.log(req.body.action);

	if (!req.body.action || allowedActions.indexOf(req.body.action) === -1) {
		return res.status(500).json({
			error: `Action ${req.body.action} not allowed`,
		});
	} else {
		axios({
			method: 'post',
			url: 'http://35.188.62.54:7076',
			data: req.body,
		}).then(async (results) => {
			res.json(results.data);
		});
	}
});

app.listen(process.env.PORT || 5000, '0.0.0.0');
