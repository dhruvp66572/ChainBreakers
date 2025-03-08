const axios = require('axios');

async function getTransactions(req, res) {
  try {
    const response = await axios.get('https://testnet.mirrornode.hedera.com/api/v1/transactions');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).send('Server error');
  }
}

module.exports = { getTransactions };