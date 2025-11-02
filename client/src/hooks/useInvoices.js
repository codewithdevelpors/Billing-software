import { useState, useEffect } from 'react';
import axios from 'axios';

const useInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/invoices');
      setInvoices(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addInvoice = async (invoice) => {
    try {
      const response = await axios.post('/api/invoices', invoice);
      setInvoices([...invoices, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateInvoice = async (id, updatedInvoice) => {
    try {
      const response = await axios.put(`/api/invoices/${id}`, updatedInvoice);
      setInvoices(invoices.map(inv => inv._id === id ? response.data : inv));
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteInvoice = async (id) => {
    try {
      await axios.delete(`/api/invoices/${id}`);
      setInvoices(invoices.filter(inv => inv._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { invoices, loading, error, addInvoice, updateInvoice, deleteInvoice, fetchInvoices };
};

export default useInvoices;
