import React, { useState, useEffect } from 'react';
import { calculateSubtotal, calculateTax, calculateTotal } from '../../utils/calculations';
import './InvoiceForm.css';

const InvoiceForm = ({ invoice, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    client: '',
    date: '',
    items: [{ description: '', quantity: 1, price: 0 }],
    taxRate: 0,
    status: 'unpaid'
  });

  useEffect(() => {
    if (invoice) {
      setFormData(invoice);
    }
  }, [invoice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, price: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const subtotal = calculateSubtotal(formData.items);
  const tax = calculateTax(subtotal, formData.taxRate);
  const total = calculateTotal(subtotal, tax);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, subtotal, tax, total });
  };

  return (
    <div className="invoice-form">
      <h2>{invoice ? 'Edit Invoice' : 'Create Invoice'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Client:</label>
          <input
            type="text"
            name="client"
            value={formData.client}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Tax Rate (%):</label>
          <input
            type="number"
            name="taxRate"
            value={formData.taxRate}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <h3>Items</h3>
        {formData.items.map((item, index) => (
          <div key={index} className="item">
            <input
              type="text"
              placeholder="Description"
              value={item.description}
              onChange={(e) => handleItemChange(index, 'description', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
              min="1"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={item.price}
              onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
              min="0"
              step="0.01"
              required
            />
            <button type="button" onClick={() => removeItem(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addItem}>Add Item</button>
        <div className="calculations">
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Tax: ${tax.toFixed(2)}</p>
          <p>Total: ${total.toFixed(2)}</p>
        </div>
        <div className="form-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
