import { useState, useEffect } from 'react';

const useInvoices = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const storedInvoices = localStorage.getItem('invoices');
    if (storedInvoices) {
      setInvoices(JSON.parse(storedInvoices));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  const addInvoice = (invoice) => {
    setInvoices([...invoices, { ...invoice, id: Date.now() }]);
  };

  const updateInvoice = (id, updatedInvoice) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, ...updatedInvoice } : inv));
  };

  const deleteInvoice = (id) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
  };

  return { invoices, addInvoice, updateInvoice, deleteInvoice };
};

export default useInvoices;
