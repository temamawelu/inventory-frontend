import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faBox, 
  faTags, 
  faTruck, 
  faArrowDown, 
  faArrowUp, 
  faHistory,
  faExclamationTriangle, 
  faUserCircle,
  faUsers
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const isAdmin = user?.role_name === 'admin';
  
  // Base menu for all users
  let menuItems = [
    { path: '/dashboard', label: t('nav.dashboard'), icon: faTachometerAlt },
    { path: '/products', label: t('nav.products'), icon: faBox },
    { path: '/receipt', label: t('transactions.receipt'), icon: faArrowDown },
    { path: '/issue', label: t('transactions.issue'), icon: faArrowUp },
    { path: '/transactions', label: t('transactions.transactionHistory'), icon: faHistory },
    { path: '/low-stock', label: t('nav.lowStock'), icon: faExclamationTriangle },
    { path: '/profile', label: t('nav.profile'), icon: faUserCircle },
  ];
  
  // Admin only menu items
  if (isAdmin) {
    const adminItems = [
      { path: '/categories', label: t('nav.categories'), icon: faTags },
      { path: '/suppliers', label: t('nav.suppliers'), icon: faTruck },
      { path: '/users', label: t('users.title'), icon: faUsers },
    ];
    // Insert admin items after Products
    menuItems = [
      menuItems[0], // Dashboard
      menuItems[1], // Products
      ...adminItems,
      ...menuItems.slice(2), // Rest of items
    ];
  }

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
