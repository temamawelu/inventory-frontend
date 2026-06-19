import api from './api';

// ============ User Management (Admin) ============
export const getUsers = async () => {
    const response = await api.get('/users');
    return response.data;
};

export const getUserById = async (id) => {
    const response = await api.get('/users/' + id);
    return response.data;
};

export const createUser = async (data) => {
    const response = await api.post('/users', data);
    return response.data;
};

export const updateUser = async (id, data) => {
    const response = await api.put('/users/' + id, data);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete('/users/' + id);
    return response.data;
};

export const updateUserPassword = async (id, password) => {
    const response = await api.put('/users/' + id + '/password', { password });
    return response.data;
};

export const getRoles = async () => {
    const response = await api.get('/users/roles');
    return response.data;
};

export const getTotalUsers = async () => {
    const response = await api.get('/users/total');
    return response.data;
};

// ============ Profile (Self) ============
export const getProfile = async () => {
    const response = await api.get('/profile');
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await api.put('/profile', data);
    return response.data;
};

export const updatePassword = async (data) => {
    const response = await api.put('/profile/password', data);
    return response.data;
};

export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};
