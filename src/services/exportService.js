const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const exportProducts = () => {
    const token = localStorage.getItem('token');
    window.open(`${API_URL}/export/products?token=${token}`, '_blank');
};

export const exportTransactions = () => {
    const token = localStorage.getItem('token');
    window.open(`${API_URL}/export/transactions?token=${token}`, '_blank');
};

export const exportLowStock = () => {
    const token = localStorage.getItem('token');
    window.open(`${API_URL}/export/low-stock?token=${token}`, '_blank');
};
