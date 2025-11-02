import { useState, useEffect } from 'react';
import axios from 'axios';

const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/customers');
      setCustomers(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customer) => {
    try {
      const response = await axios.post('/api/customers', customer);
      setCustomers([...customers, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateCustomer = async (id, updatedCustomer) => {
    try {
      const response = await axios.put(`/api/customers/${id}`, updatedCustomer);
      setCustomers(customers.map(cust => cust._id === id ? response.data : cust));
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await axios.delete(`/api/customers/${id}`);
      setCustomers(customers.filter(cust => cust._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { customers, loading, error, addCustomer, updateCustomer, deleteCustomer, fetchCustomers };
};

export default useCustomers;
