import React, { useState, useEffect } from 'react';
import { goodsReceipt, goodsIssue, getMovements } from '../../services/stockService';
import { getArticles } from '../../services/articleService';

const StockMovement = () => {
  const [articles, setArticles] = useState([]);
  const [movements, setMovements] = useState([]);
  const [movementType, setMovementType] = useState('receipt');
  const [formData, setFormData] = useState({ article_id: '', quantity: '', reference_number: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => { fetchArticles(); fetchMovements(); }, []);

  const fetchArticles = async () => { const response = await getArticles(); setArticles(response.data); };
  const fetchMovements = async () => { const response = await getMovements(); setMovements(response.data); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const data = {
        article_id: parseInt(formData.article_id),
        quantity: parseInt(formData.quantity),
        reference_number: formData.reference_number,
        notes: formData.notes
      };
      if (movementType === 'receipt') {
        await goodsReceipt(data);
        setMessage({ type: 'success', text: '✅ Goods receipt recorded successfully' });
      } else {
        await goodsIssue(data);
        setMessage({ type: 'success', text: '✅ Goods issue recorded successfully' });
      }
      setFormData({ article_id: '', quantity: '', reference_number: '', notes: '' });
      fetchMovements();
      fetchArticles();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>Stock Movement</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Record Stock Movement</h3>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <button className={movementType === 'receipt' ? 'btn btn-success' : 'btn btn-secondary'} onClick={() => setMovementType('receipt')}>📥 Goods Receipt (Add Stock)</button>
            <button className={movementType === 'issue' ? 'btn btn-danger' : 'btn btn-secondary'} onClick={() => setMovementType('issue')}>📤 Goods Issue (Remove Stock)</button>
          </div>
          {message && <div className={message.type === 'success' ? 'success' : 'error'}>{message.text}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Article</label>
              <select value={formData.article_id} onChange={(e) => setFormData({...formData, article_id: e.target.value})} required>
                <option value="">Select an article...</option>
                {articles.map(article => (
                  <option key={article.id} value={article.id}>{article.sku} - {article.name} (Stock: {article.current_stock})</option>
                ))}
              </select>
            </div>
            <div className="form-group"><label>Quantity</label><input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required min="1" /></div>
            <div className="form-group"><label>Reference Number (Optional)</label><input type="text" value={formData.reference_number} onChange={(e) => setFormData({...formData, reference_number: e.target.value})} placeholder="PO-123, SO-456, etc." /></div>
            <div className="form-group"><label>Notes (Optional)</label><textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows="3" /></div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>{loading ? 'Processing...' : `Record ${movementType === 'receipt' ? 'Goods Receipt' : 'Goods Issue'}`}</button>
          </form>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Recent Movements</h3>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table style={{ fontSize: '14px' }}>
              <thead><tr><th>Product</th><th>Type</th><th>Qty</th><th>Date</th></tr></thead>
              <tbody>
                {movements.slice(0, 15).map((movement) => (
                  <tr key={movement.id}>
                    <td>{movement.article_name}</td>
                    <td>{movement.movement_type === 'GOODS_RECEIPT' ? '📥 Receipt' : '📤 Issue'}</td>
                    <td>{movement.quantity}</td>
                    <td>{new Date(movement.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {movements.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center' }}>No movements yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockMovement;
