import React, { useState, useEffect } from 'react';

export default function AddTransactionForm({ onAdd, editing, onUpdate, onCancel }) {
  const empty = { type: 'expense', amount: '', category: 'General', description: '', date: new Date().toISOString().slice(0,10) };
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (editing) {
      setForm({
        type: editing.type,
        amount: editing.amount,
        category: editing.category,
        description: editing.description,
        date: editing.date ? new Date(editing.date).toISOString().slice(0,10) : new Date().toISOString().slice(0,10)
      });
    }
  }, [editing]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...form, amount: Number(form.amount), date: new Date(form.date) };
    if (!payload.amount || isNaN(payload.amount)) return alert('Enter a valid amount');
    if (editing) onUpdate(editing._id, payload);
    else onAdd(payload);
    setForm(empty);
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom:'20px', display:'flex', gap:'10px', flexWrap:'wrap' }}>
      <select name="type" value={form.type} onChange={handleChange}>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <input name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" required />
      <input name="category" value={form.category} onChange={handleChange} placeholder="Category" />
      <input name="date" type="date" value={form.date} onChange={handleChange} />
      <input name="description" value={form.description} onChange={handleChange} placeholder="Description" />

      <button type="submit">{editing ? 'Update' : 'Add'}</button>
      {editing && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
}
