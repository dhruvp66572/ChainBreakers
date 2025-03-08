// config/hederaClient.js

const { Client } = require('@hashgraph/sdk');
require('dotenv').config();

const client = Client.forTestnet();
client.setOperator(process.env.ACCOUNT_ID, process.env.PRIVATE_KEY);

module.exports = client;
