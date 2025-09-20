import React from 'react';

export default function Summary({ summary }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Summary</h2>
      <div>Income: <strong>{summary.totalIncome}</strong></div>
      <div>Expense: <strong>{summary.totalExpense}</strong></div>
      <div>Balance: <strong>{summary.balance}</strong></div>
    </div>
  );
}
