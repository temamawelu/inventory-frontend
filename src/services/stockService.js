import api from './api';

export const getDashboard = async () => {
  const response = await api.get('/stock/dashboard');
  return response.data;
};

export const getLowStock = async () => {
  const response = await api.get('/stock/low-stock');
  return response.data;
};

export const getMovements = async (articleId = null) => {
  const url = articleId ? `/stock/movements?article_id=${articleId}` : '/stock/movements';
  const response = await api.get(url);
  return response.data;
};

export const goodsReceipt = async (data) => {
  const response = await api.post('/stock/goods-receipt', data);
  return response.data;
};

export const goodsIssue = async (data) => {
  const response = await api.post('/stock/goods-issue', data);
  return response.data;
};
