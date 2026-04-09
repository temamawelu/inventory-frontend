import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faBox, faTags, faExchangeAlt, faExclamationTriangle, faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: faTachometerAlt },
    { path: '/products', label: 'Products', icon: faBox },
    { path: '/categories', label: 'Categories', icon: faTags },
    { path: '/transactions', label: 'Transactions', icon: faExchangeAlt },
    { path: '/low-stock', label: 'Low Stock', icon: faExclamationTriangle },
    { path: '/profile', label: 'My Profile', icon: faUserCircle },
  ];

  return (
    <div style={{
      width: '260px',
      backgroundColor: '#1f2937',
      color: 'white',
      height: 'calc(100vh - 60px)',
      position: 'fixed',
      left: 0,
      top: '60px',
      overflowY: 'auto'
    }}>
      <ul style={{ listStyle: 'none', padding: '20px 0' }}>
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                color: 'white',
                textDecoration: 'none',
                backgroundColor: location.pathname === item.path ? '#374151' : 'transparent',
                borderLeft: location.pathname === item.path ? '4px solid #3b82f6' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <FontAwesomeIcon icon={item.icon} style={{ width: '20px' }} />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;