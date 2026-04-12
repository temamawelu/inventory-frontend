import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState('receipt');
  const [formData, setFormData] = useState({
    product_id: '',
    quantity: '',
    reference_number: '',
    notes: ''
  });

  const exportToExcel = () => {
    const token = localStorage.getItem('token');
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    window.open(`${apiUrl}/export/transactions?token=${token}`, '_blank');
  };

  useEffect(() => {
    fetchTransactions();
    fetchProducts();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions/history');
      setTransactions(response.data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = transactionType === 'receipt' ? '/transactions/receipt' : '/transactions/issue';
      await api.post(endpoint, {
        product_id: parseInt(formData.product_id),
        quantity: parseInt(formData.quantity),
        reference_number: formData.reference_number,
        notes: formData.notes
      });
      alert('Transaction recorded successfully');
      setShowModal(false);
      setFormData({ product_id: '', quantity: '', reference_number: '', notes: '' });
      fetchTransactions();
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to record transaction');
    }
  };

  if (loading) return <div className="loading">Loading transactions...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600' }}>🔄 Stock Transactions</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-success" onClick={exportToExcel}>
            📊 Export Excel
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + New Transaction
          </button>
        </div>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: '12px' }}>Product</th>
              <th style={{ padding: '12px' }}>Type</th>
              <th style={{ padding: '12px' }}>Quantity</th>
              <th style={{ padding: '12px' }}>Reference</th>
              <th style={{ padding: '12px' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px' }}>{transaction.product_name}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    background: transaction.transaction_type_name === 'GOODS_RECEIPT' ? '#d1fae5' : '#fee2e2',
                    color: transaction.transaction_type_name === 'GOODS_RECEIPT' ? '#059669' : '#dc2626',
                    padding: '4px 8px',
                    borderRadius: '20px',
                    fontSize: '12px'
                  }}>
                    {transaction.transaction_type_name === 'GOODS_RECEIPT' ? '📥 Receipt' : '📤 Issue'}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>{transaction.quantity}</td>
                <td style={{ padding: '12px' }}>{transaction.reference_number || '-'}</td>
                <td style={{ padding: '12px' }}>{new Date(transaction.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
          alignItems: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '450px', maxWidth: '90%' }}>
            <h3 style={{ marginBottom: '16px' }}>New Stock Transaction</h3>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button type="button" className={transactionType === 'receipt' ? 'btn btn-success' : 'btn btn-secondary'} onClick={() => setTransactionType('receipt')} style={{ flex: 1 }}>📥 Goods Receipt</button>
              <button type="button" className={transactionType === 'issue' ? 'btn btn-danger' : 'btn btn-secondary'} onClick={() => setTransactionType('issue')} style={{ flex: 1 }}>📤 Goods Issue</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product</label>
                <select value={formData.product_id} onChange={(e) => setFormData({...formData, product_id: e.target.value})} required>
                  <option value="">Select a product...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.sku} - {p.name} (Stock: {p.quantity_on_hand})</option>)}
                </select>
              </div>
              <div className="form-group"><label>Quantity *</label><input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required min="1" /></div>
              <div className="form-group"><label>Reference Number</label><input type="text" value={formData.reference_number} onChange={(e) => setFormData({...formData, reference_number: e.target.value})} placeholder="PO-123, SO-456" /></div>
              <div className="form-group"><label>Notes</label><textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows="2" /></div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className={transactionType === 'receipt' ? 'btn btn-success' : 'btn btn-danger'}>Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
