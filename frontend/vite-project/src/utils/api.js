// frontend/src/utils/api.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/transactions';

export const fetchTransactions = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.transactions; // Adjust based on the API response structure
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};
