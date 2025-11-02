import { useState, useEffect } from 'react';
import axios from 'axios';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product) => {
    try {
      const response = await axios.post('/api/products', product);
      setProducts([...products, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      const response = await axios.put(`/api/products/${id}`, updatedProduct);
      setProducts(products.map(prod => prod._id === id ? response.data : prod));
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(products.filter(prod => prod._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getProductByBarcode = async (barcode) => {
    try {
      const response = await axios.get(`/api/products/barcode/${barcode}`);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { products, loading, error, addProduct, updateProduct, deleteProduct, getProductByBarcode, fetchProducts };
};

export default useProducts;
