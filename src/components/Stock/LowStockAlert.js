import React, { useState, useEffect } from 'react';
import { getLowStock } from '../../services/stockService';

const LowStockAlert = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAlerts(); }, []);

  const fetchAlerts = async () => {
    try {
      const response = await getLowStock();
      setAlerts(response.data);
    } catch (error) { console.error(error);
    } finally { setLoading(false); }
  };

  if (loading) return <div className="loading">Loading alerts...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>⚠️ Low Stock Alerts</h1>
      <div className="card">
        {alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#10b981' }}>✅ All products have sufficient stock!</div>
        ) : (
          <table>
            <thead>
              <tr><th>SKU</th><th>Product Name</th><th>Current Stock</th><th>Min Threshold</th><th>Location</th><th>Status</th></tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.id}>
                  <td>{alert.sku}</td>
                  <td>{alert.name}</td>
                  <td style={{ color: '#dc2626', fontWeight: 'bold' }}>{alert.current_stock}</td>
                  <td>{alert.min_stock_threshold}</td>
                  <td>{alert.location || '-'}</td>
                  <td><span style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '4px 8px', borderRadius: '4px' }}>⚠️ Low Stock</span></td>
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
