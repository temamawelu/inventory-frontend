import api from './api';

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (data) => {
  const response = await api.post('/products', data);
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await api.put(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const searchProducts = async (query) => {
  const response = await api.get(`/products/search?q=${query}`);
  return response.data;
};

export const getLowStockProducts = async () => {
  const response = await api.get('/products/low-stock');
  return response.data;
};

export const getCategories = async () => {
  // If you have categories endpoint, otherwise return empty array
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    return { data: [] };
  }
};