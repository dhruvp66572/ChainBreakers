// backend/services/mirrorNodeService.js

const axios = require('axios');

const BASE_URL = 'https://testnet.mirrornode.hedera.com/api/v1';

/**
 * Fetch transactions from the Mirror Node API
 * @returns {Promise<Object>} - Transaction data
 */
async function getTransactions() {
  try {
    const response = await axios.get(`${BASE_URL}/transactions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }
}

module.exports = { getTransactions };
