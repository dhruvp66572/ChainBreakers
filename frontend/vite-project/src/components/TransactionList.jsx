// frontend/src/components/TransactionList.jsx

import React from 'react';

const TransactionList = ({ transactions }) => {
  return (
    <div>
      <h2>Transactions</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.transaction_id}>
            {transaction.transaction_id} - {transaction.entity_id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
