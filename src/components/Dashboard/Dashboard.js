import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faExclamationTriangle, faExchangeAlt, faDollarSign } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/dashboard');
      setData(response.data.data);
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  const totalValue = data?.total_inventory_value || 0;
  const formattedValue = typeof totalValue === 'number' ? totalValue.toFixed(2) : parseFloat(String(totalValue)).toFixed(2);

  const stats = [
    { title: 'Total Products', value: data?.total_products || 0, color: '#2563eb', icon: faBox },
    { title: 'Low Stock Alerts', value: data?.low_stock_alerts || 0, color: '#dc2626', icon: faExclamationTriangle },
    { title: "Today's Transactions", value: data?.today_transactions || 0, color: '#10b981', icon: faExchangeAlt },
    { title: 'Inventory Value', value: '$' + formattedValue, color: '#f59e0b', icon: faDollarSign },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '28px', fontWeight: '600' }}>Dashboard</h1>
         <div className="card">
        <h3 style={{ marginBottom: '16px' }}>Welcome to Inventory Management System</h3> 
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
        {stats.map((stat, index) => (
          <div key={index} className="card" style={{ textAlign: 'center' }}>
            <FontAwesomeIcon icon={stat.icon} size="2x" style={{ color: stat.color, marginBottom: '8px' }} />
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: stat.color }}>{stat.value}</p>
            <h3 style={{ fontSize: '14px', color: '#6b7280' }}>{stat.title}</h3>
          </div>
        ))}
      </div>
   
    </div>
  );
};

export default Dashboard;