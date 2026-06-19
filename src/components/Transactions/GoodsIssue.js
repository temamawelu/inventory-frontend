import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useTranslation } from 'react-i18next';

const GoodsIssue = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    product_id: '',
    quantity: '',
    reference_number: '',
    notes: ''
  });
  const [message, setMessage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchRecentIssues();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentIssues = async () => {
    try {
      const response = await api.get('/transactions/history');
      const allTransactions = response.data.data || [];
      const issues = allTransactions.filter(t => t.transaction_type_name === 'GOODS_ISSUE');
      setTransactions(issues);
    } catch (error) {
      console.error('Error fetching issues:', error);
    }
  };

  const handleProductSelect = (productId) => {
    const product = products.find(p => p.id === parseInt(productId));
    setSelectedProduct(product);
    setFormData({ ...formData, product_id: productId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const data = {
        product_id: parseInt(formData.product_id),
        quantity: parseInt(formData.quantity),
        reference_number: formData.reference_number,
        notes: formData.notes
      };

      await api.post('/transactions/issue', data);
      
      setMessage({ type: 'success', text: 'Goods issue recorded successfully!' });
      setFormData({
        product_id: '',
        quantity: '',
        reference_number: '',
        notes: ''
      });
      setSelectedProduct(null);
      fetchProducts();
      fetchRecentIssues();

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to record issue' });
    }
  };

  if (loading) return <div className="loading">{t('Loading products...')}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600' }}>{t('Goods Issue')}</h1>
      </div>

      {/* Form Card */}
      <div className="card" style={{ maxWidth: '600px', marginBottom: '24px' }}>

        
        {message && (
          <div className={message.type === 'success' ? 'success' : 'error'} style={{ marginBottom: '16px' }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Product *</label>
            <select
              value={formData.product_id}
              onChange={(e) => handleProductSelect(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
            >
              <option value="">Select a product...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.sku} - {p.name} (Stock: {p.quantity_on_hand})
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <div style={{
              background: selectedProduct.quantity_on_hand <= selectedProduct.reorder_point ? '#fef2f2' : '#f3f4f6',
              padding: '10px 14px',
              borderRadius: '6px',
              marginBottom: '16px',
              borderLeft: selectedProduct.quantity_on_hand <= selectedProduct.reorder_point ? '4px solid #dc2626' : '4px solid #10b981'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: '#6b7280' }}>{t('Current Stock:')}</span>
                <span style={{ fontWeight: '600' }}>{selectedProduct.quantity_on_hand}  {t('units')}</span>
              </div>
              {selectedProduct.quantity_on_hand <= selectedProduct.reorder_point && (
                <div style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                  {t('⚠️ Low Stock Alert! Reorder point: {selectedProduct.reorder_point}')}
                </div>
              )}
            </div>
          )}

          <div className="form-group">
            <label>{t('Quantity to Remove *)')}</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
              min="1"
              max={selectedProduct?.quantity_on_hand || 0}
              placeholder="Enter quantity"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
            />
            {selectedProduct && (
              <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                {t('Max available:')} <strong>{selectedProduct.quantity_on_hand}</strong> {t('units')}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>{t('Reference Number')}</label>
            <input
              type="text"
              value={formData.reference_number}
              onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
              placeholder="SO-123, ORDER-001"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
            />
          </div>

          <div className="form-group">
            <label>{t('Notes')}</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="3"
              placeholder="Any additional notes..."
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
            />
          </div>

          <button type="submit" className="btn btn-danger" style={{ width: '100%', padding: '12px' }}>
            {t('📤 Record Issue')}
          </button>
        </form>
      </div>

      {/* Recent Issues Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
   
        <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '600' }}>{t('📋 Recent Issues')}</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: '12px' }}>{t('Product')}</th>
              <th style={{ padding: '12px' }}>{t('Quantity')}</th>
              <th style={{ padding: '12px' }}>{t('Reference')}</th>
              <th style={{ padding: '12px' }}>{t('Date')}</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 10).map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px' }}>{t.product_name}</td>
                <td style={{ padding: '12px' }}>{t.quantity}</td>
                <td style={{ padding: '12px' }}>{t.reference_number || '-'}</td>
                <td style={{ padding: '12px' }}>{new Date(t.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                  {t('No issues recorded yet')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GoodsIssue;
