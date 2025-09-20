import React, { useEffect, useState } from "react";
import axios from "axios";
import TransactionList from "./components/TransactionList";
import Summary from "./components/Summary";
import AddTransactionForm from "./components/AddTransactionForm";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function FinTrack() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [editing, setEditing] = useState(null);

  async function fetchTransactions() {
    const res = await axios.get(`${API}/api/transactions`);
    setTransactions(res.data);
  }

  async function fetchSummary() {
    const res = await axios.get(`${API}/api/summary`);
    setSummary(res.data);
  }

  useEffect(() => {
    fetchTransactions();
    fetchSummary();
  }, []);

  async function addTransaction(data) {
    await axios.post(`${API}/api/transactions`, data);
    fetchTransactions();
    fetchSummary();
  }

  async function updateTransaction(id, data) {
    await axios.put(`${API}/api/transactions/${id}`, data);
    setEditing(null);
    fetchTransactions();
    fetchSummary();
  }

  async function deleteTransaction(id) {
    await axios.delete(`${API}/api/transactions/${id}`);
    fetchTransactions();
    fetchSummary();
  }

  return (
    <main className="content">
      <Summary summary={summary} />

      <AddTransactionForm
        onAdd={addTransaction}
        editing={editing}
        onUpdate={updateTransaction}
        onCancel={() => setEditing(null)}
      />

      <TransactionList
        transactions={transactions}
        onEdit={setEditing}
        onDelete={deleteTransaction}
      />
    </main>
  );
}
