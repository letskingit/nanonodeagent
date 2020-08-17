const express = require('express');
const axios = require('axios').default;
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const allowedActions = ['account_history', 'account_info', 'accounts_frontiers', 'accounts_balances', 'accounts_pending', 'block', 'blocks', 'block_count', 'blocks_info', 'delegators_count', 'pending', 'process', 'representatives_online', 'validate_account_number'];

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
