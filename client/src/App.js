import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import InvoiceList from './components/InvoiceList/InvoiceList';
import InvoiceForm from './components/InvoiceForm/InvoiceForm';
import POS from './components/POS/POS';
import useInvoices from './hooks/useInvoices';
import './App.css';

function AppContent() {
  const { user, logout } = useAuth();
  const { invoices, addInvoice, updateInvoice, deleteInvoice } = useInvoices();
  const [currentView, setCurrentView] = useState('dashboard');
  const [editingInvoice, setEditingInvoice] = useState(null);

  if (!user) {
    return <Login />;
  }

  const handleSaveInvoice = (invoice) => {
    if (editingInvoice) {
      updateInvoice(editingInvoice._id, invoice);
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
      case 'pos':
        return <POS />;
      default:
        return <Dashboard invoices={invoices} />;
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <h1>Billing & POS Management</h1>
        <div className="nav-links">
          <button onClick={() => setCurrentView('dashboard')}>Dashboard</button>
          <button onClick={() => setCurrentView('pos')}>POS</button>
          <button onClick={() => setCurrentView('list')}>Invoices</button>
          <button onClick={() => { setEditingInvoice(null); setCurrentView('form'); }}>New Invoice</button>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>
      <main>
        {renderView()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
