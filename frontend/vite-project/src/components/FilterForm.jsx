// frontend/src/components/FilterForm.jsx

import React, { useState } from 'react';

const FilterForm = ({ onFilter }) => {
  const [accountId, setAccountId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(accountId);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Filter by Account ID:
        <input
          type="text"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        />
      </label>
      <button type="submit">Filter</button>
    </form>
  );
};

export default FilterForm;
