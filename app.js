const config = require('./config');
const express = require('express');
const axios = require('axios').default;
const cors = require('cors');
const os = require('os');
const app = express();

const allowedActions = ['account_history', 'account_info', 'accounts_frontiers', 'accounts_balances', 'accounts_pending', 'block', 'blocks', 'block_count', 'blocks_info', 'bootstrap_status', 'delegators_count', 'pending', 'process', 'representatives_online', 'validate_account_number'];

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.all('/rpc', (req, res) => {
	if (os.loadavg()[0] > 0.95) {
		return res.status(500).json({
			error: `Overloaded, Let me rest My Man !`,
		});
	} else {
		if (!req.body.action || allowedActions.indexOf(req.body.action) === -1) {
			return res.status(500).json({
				error: `Action ${req.body.action} not allowed`,
			});
		} else {
			return axios({
				method: 'post',
				url: 'http://127.0.0.1:7076',
				data: req.body,
			})
				.then((results) => {
					return res.json(results.data);
				})
				.catch(function (error) {
					return res.status(500).json({
						error: `Error Connecting With NANO Node`,
					});
				});
		}
	}
});

app.all('/status', (req, res) => {
	res.json({
		architecture: os.arch(),
		ostype: os.type(),
		uptime: os.uptime(),
		totalmemory: os.totalmem(),
		freememory: os.freemem(),
		load: os.loadavg(),
		owner: {
			nano: config.yournanoaddress,
			twitter: config.yourtwitterusername,
		},
	});
});

app.all('*', function (req, res) {
	res.redirect('/');
});

app.listen(process.env.PORT || config.port, '0.0.0.0');
