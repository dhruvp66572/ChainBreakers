// services/hashpackService.js

const { HashConnect } = require('hashconnect');
require('dotenv').config();

let hashconnect;
let appMetadata;
let savedPairings = [];

/**
 * Initialize HashConnect
 * @returns {Promise<Object>} - HashConnect instance and metadata
 */
async function initializeHashConnect() {
  try {
    hashconnect = new HashConnect();
    
    // App metadata that will be displayed to the user when connecting
    appMetadata = {
      name: process.env.APP_NAME || 'Hedera Transaction Tracker',
      description: 'A dashboard for tracking Hedera transactions',
      icon: 'https://your-app-icon-url.com/icon.png'
    };
    
    // Initialize HashConnect
    await hashconnect.init(appMetadata, process.env.NETWORK || 'testnet', false);
    
    // Setup connection listener
    hashconnect.pairingEvent.on((pairingData) => {
      savedPairings.push(pairingData);
    });
    
    return {
      hashconnect,
      appMetadata
    };
  } catch (error) {
    console.error('Error initializing HashConnect:', error.message);
    throw new Error(`Failed to initialize HashConnect: ${error.message}`);
  }
}

/**
 * Get account transactions for a connected wallet
 * @param {string} accountId - Hedera account ID
 * @returns {Promise<Array>} - Transactions for the account
 */
async function getAccountTransactions(accountId) {
  try {
    if (!accountId) {
      throw new Error('Account ID is required');
    }
    
    const url = `${process.env.NETWORK === 'mainnet' 
      ? 'https://mainnet-public.mirrornode.hedera.com' 
      : 'https://testnet.mirrornode.hedera.com'}/api/v1/transactions`;
    
    const response = await axios.get(url, {
      params: {
        account_id: accountId,
        limit: 100,
        order: 'desc'
      }
    });
    
    return response.data.transactions;
  } catch (error) {
    console.error('Error fetching account transactions:', error.message);
    throw new Error(`Failed to fetch account transactions: ${error.message}`);
  }
}

module.exports = {
  initializeHashConnect,
  getAccountTransactions
};
