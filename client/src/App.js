import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import InvoiceList from './components/InvoiceList/InvoiceList';
import InvoiceForm from './components/InvoiceForm/InvoiceForm';
import useInvoices from './hooks/useInvoices';

function App() {
  const { invoices, addInvoice, updateInvoice, deleteInvoice } = useInvoices();
  const [currentView, setCurrentView] = useState('dashboard');
  const [editingInvoice, setEditingInvoice] = useState(null);

  const handleSaveInvoice = (invoice) => {
    if (editingInvoice) {
      updateInvoice(editingInvoice.id, invoice);
    } else {
      addInvoice(invoice);
    }
    setCurrentView('list');
    setEditingInvoice(null);
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setCurrentView('form');
  };

  const handleCancelForm = () => {
    setCurrentView('list');
    setEditingInvoice(null);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard invoices={invoices} />;
      case 'list':
        return <InvoiceList invoices={invoices} onEdit={handleEditInvoice} onDelete={deleteInvoice} />;
      case 'form':
        return <InvoiceForm invoice={editingInvoice} onSave={handleSaveInvoice} onCancel={handleCancelForm} />;
      default:
        return <Dashboard invoices={invoices} />;
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <h1>Invoice and Billing Management</h1>
        <div className="nav-links">
          <button onClick={() => setCurrentView('dashboard')}>Dashboard</button>
          <button onClick={() => setCurrentView('list')}>Invoice List</button>
          <button onClick={() => { setEditingInvoice(null); setCurrentView('form'); }}>Create Invoice</button>
        </div>
      </nav>
      <main>
        {renderView()}
      </main>
    </div>
  );
}

export default App;
