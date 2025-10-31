import React from 'react';
import './Dashboard.css';

const Dashboard = ({ invoices }) => {
  const totalInvoices = invoices.length;
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
  const unpaidInvoices = totalInvoices - paidInvoices;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats">
        <div className="stat-card">
          <h3>Total Invoices</h3>
          <p>{totalInvoices}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Paid Invoices</h3>
          <p>{paidInvoices}</p>
        </div>
        <div className="stat-card">
          <h3>Unpaid Invoices</h3>
          <p>{unpaidInvoices}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
