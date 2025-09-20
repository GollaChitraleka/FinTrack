import React from 'react';

export default function TransactionList({ transactions, onEdit, onDelete }) {
  return (
    <div>
      <h2>Transactions</h2>
      <div class="table-wrapper">
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx._id}>
              <td>{new Date(tx.date).toLocaleDateString()}</td>
              <td>{tx.type}</td>
              <td>{tx.category}</td>
              <td>{tx.description}</td>
              <td className={tx.type}>{tx.amount}</td>
              <td>
                  <button className="edit" onClick={() => onEdit(tx)}>Edit</button>
                  <button className="delete" onClick={() => { if(window.confirm('Delete this?')) onDelete(tx._id); }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
