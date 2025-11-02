import React, { useState, useEffect } from 'react';
import useProducts from '../../hooks/useProducts';
import useCustomers from '../../hooks/useCustomers';
import useInvoices from '../../hooks/useInvoices';
import { calculateSubtotal, calculateTax, calculateTotal } from '../../utils/calculations';
import './POS.css';

const POS = () => {
  const { products, getProductByBarcode } = useProducts();
  const { customers } = useCustomers();
  const { addInvoice } = useInvoices();
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [taxRate, setTaxRate] = useState(0);
  const [barcode, setBarcode] = useState('');

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product._id === product._id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.product._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1, price: product.price, discount: 0 }]);
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.product._id === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product._id !== productId));
  };

  const handleBarcodeScan = async () => {
    if (barcode) {
      try {
        const product = await getProductByBarcode(barcode);
        addToCart(product);
        setBarcode('');
      } catch (err) {
        alert('Product not found');
      }
    }
  };

  const subtotal = calculateSubtotal(cart);
  const tax = calculateTax(subtotal, taxRate);
  const total = calculateTotal(subtotal, tax);

  const handleCheckout = async () => {
    const invoice = {
      client: selectedCustomer || 'Walk-in Customer',
      date: new Date().toISOString().split('T')[0],
      items: cart.map(item => ({
        product: item.product._id,
        description: item.product.name,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount
      })),
      subtotal,
      tax,
      total,
      paymentMethod,
      status: 'paid',
      customer: selectedCustomer ? customers.find(c => c._id === selectedCustomer)?._id : null
    };

    try {
      await addInvoice(invoice);
      setCart([]);
      setSelectedCustomer('');
      alert('Invoice created successfully!');
    } catch (err) {
      alert('Error creating invoice');
    }
  };

  return (
    <div className="pos">
      <div className="pos-header">
        <h2>Point of Sale</h2>
        <div className="barcode-input">
          <input
            type="text"
            placeholder="Scan barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleBarcodeScan()}
          />
          <button onClick={handleBarcodeScan}>Scan</button>
        </div>
      </div>

      <div className="pos-content">
        <div className="product-list">
          <h3>Products</h3>
          <div className="products-grid">
            {products.map(product => (
              <div key={product._id} className="product-item" onClick={() => addToCart(product)}>
                <h4>{product.name}</h4>
                <p>${product.price}</p>
                <p>Stock: {product.stock}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="cart">
          <h3>Cart</h3>
          <div className="customer-select">
            <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
              <option value="">Walk-in Customer</option>
              {customers.map(customer => (
                <option key={customer._id} value={customer._id}>{customer.name}</option>
              ))}
            </select>
          </div>

          <div className="cart-items">
            {cart.map(item => (
              <div key={item.product._id} className="cart-item">
                <span>{item.product.name}</span>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.product._id, parseInt(e.target.value))}
                  min="1"
                />
                <span>${(item.quantity * item.price).toFixed(2)}</span>
                <button onClick={() => removeFromCart(item.product._id)}>Remove</button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="tax-rate">
              <label>Tax Rate (%):</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value))}
                min="0"
                step="0.01"
              />
            </div>
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>Tax: ${tax.toFixed(2)}</p>
            <p>Total: ${total.toFixed(2)}</p>

            <div className="payment-method">
              <label>Payment Method:</label>
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="digital">Digital</option>
              </select>
            </div>

            <button className="checkout-btn" onClick={handleCheckout} disabled={cart.length === 0}>
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
