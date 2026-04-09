import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const LowStockAlert = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  const fetchLowStockProducts = async () => {
    try {
      const response = await api.get('/products/low-stock');
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading alerts...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '28px', fontWeight: '600' }}>⚠️ Low Stock Alerts</h1>
      <div className="card">
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#10b981' }}>
            ✅ All products have sufficient stock!
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ padding: '12px' }}>SKU</th>
                <th style={{ padding: '12px' }}>Product Name</th>
                <th style={{ padding: '12px' }}>Current Stock</th>
                <th style={{ padding: '12px' }}>Reorder Point</th>
                <th style={{ padding: '12px' }}>Location</th>
                <th style={{ padding: '12px' }}>Status</th>
               </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}>{product.sku}</td>
                  <td style={{ padding: '12px' }}>{product.name}</td>
                  <td style={{ padding: '12px', color: '#dc2626', fontWeight: 'bold' }}>{product.quantity_on_hand}</td>
                  <td style={{ padding: '12px' }}>{product.reorder_point}</td>
                  <td style={{ padding: '12px' }}>{product.location || '-'}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 8px', borderRadius: '20px', fontSize: '12px' }}>
                      ⚠️ Low Stock
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LowStockAlert;
