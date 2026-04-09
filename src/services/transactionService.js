import api from './api';

export const getDashboard = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

export const getTransactions = async (productId = null, limit = 100) => {
  let url = `/transactions/history?limit=${limit}`;
  if (productId) {
    url += `&product_id=${productId}`;
  }
  const response = await api.get(url);
  return response.data;
};

export const goodsReceipt = async (data) => {
  const response = await api.post('/transactions/receipt', data);
  return response.data;
};

export const goodsIssue = async (data) => {
  const response = await api.post('/transactions/issue', data);
  return response.data;
};