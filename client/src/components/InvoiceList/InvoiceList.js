import React, { useState } from 'react';
import './InvoiceList.css';

const InvoiceList = ({ invoices, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.client.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || inv.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="invoice-list">
      <h2>Invoice List</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by client name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map(inv => (
            <tr key={inv._id}>
              <td>{inv._id.slice(-6)}</td>
              <td>{inv.client}</td>
              <td>{new Date(inv.date).toLocaleDateString()}</td>
              <td>${inv.total.toFixed(2)}</td>
              <td>{inv.status}</td>
              <td>
                <button onClick={() => onEdit(inv)}>Edit</button>
                <button onClick={() => onDelete(inv._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceList;
