import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser, getRoles, updateUserPassword } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const UserList = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone: '',
    role_id: '2',
    is_active: true
  });
  const [passwordData, setPasswordData] = useState({ password: '' });
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await getRoles();
      setRoles(response.data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleDelete = async (id, username) => {
    if (username === currentUser?.username) {
      alert(t('users.cannotDeleteSelf'));
      return;
    }
    if (window.confirm(t('users.deleteConfirm') + ' "' + username + '"?')) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (error) {
        alert(t('users.deleteFailed'));
      }
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      full_name: '',
      phone: '',
      role_id: '2',
      is_active: true
    });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      full_name: user.full_name || '',
      phone: user.phone || '',
      role_id: user.role_id.toString(),
      is_active: user.is_active === 1
    });
    setShowModal(true);
  };

  const openPasswordModal = (userId) => {
    setSelectedUserId(userId);
    setPasswordData({ password: '' });
    setShowPasswordModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
      } else {
        await createUser(formData);
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || t('users.saveFailed'));
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUserPassword(selectedUserId, passwordData.password);
      setShowPasswordModal(false);
      alert(t('users.passwordUpdated'));
    } catch (error) {
      alert(error.response?.data?.message || t('users.passwordUpdateFailed'));
    }
  };

  if (loading) return <div className="loading">{t('users.loadingUsers')}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600' }}>{t('users.title')}</h1>
        <button className="btn btn-primary" onClick={openAddModal} style={{ padding: '10px 20px' }}>
          {t('users.addUser')}
        </button>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: '12px' }}>{t('users.id')}</th>
              <th style={{ padding: '12px' }}>{t('users.username')}</th>
              <th style={{ padding: '12px' }}>{t('users.fullName')}</th>
              <th style={{ padding: '12px' }}>{t('users.email')}</th>
              <th style={{ padding: '12px' }}>{t('users.phone')}</th>
              <th style={{ padding: '12px' }}>{t('users.role')}</th>
              <th style={{ padding: '12px' }}>{t('users.status')}</th>
              <th style={{ padding: '12px' }}>{t('users.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px' }}>{user.id}</td>
                <td style={{ padding: '12px', fontWeight: '500' }}>{user.username}</td>
                <td style={{ padding: '12px' }}>{user.full_name || '-'}</td>
                <td style={{ padding: '12px' }}>{user.email}</td>
                <td style={{ padding: '12px' }}>{user.phone || '-'}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    background: user.role_name === 'admin' ? '#e0e7ff' : '#d1fae5',
                    color: user.role_name === 'admin' ? '#4338ca' : '#065f46',
                    padding: '4px 8px',
                    borderRadius: '20px',
                    fontSize: '12px'
                  }}>
                    {user.role_name === 'admin' ? '👑 ' + t('users.admin') : '🛒 ' + t('users.cashier')}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    background: user.is_active ? '#d1fae5' : '#fee2e2',
                    color: user.is_active ? '#065f46' : '#dc2626',
                    padding: '4px 8px',
                    borderRadius: '20px',
                    fontSize: '12px'
                  }}>
                    {user.is_active ? '✅ ' + t('users.active') : '❌ ' + t('users.inactive')}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ marginRight: '8px', padding: '6px 12px' }} 
                    onClick={() => openEditModal(user)}
                  >
                    {t('users.edit')}
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    style={{ marginRight: '8px', padding: '6px 12px' }} 
                    onClick={() => openPasswordModal(user.id)}
                  >
                    🔑 {t('users.changePassword')}
                  </button>
                  <button 
                    className="btn btn-danger" 
                    style={{ padding: '6px 12px' }} 
                    onClick={() => handleDelete(user.id, user.username)}
                    disabled={user.username === currentUser?.username}
                  >
                    {t('users.delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
          alignItems: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
            <h3 style={{ marginBottom: '16px' }}>{editingUser ? t('users.editUser') : t('users.addUser')}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t('users.username')} *</label>
                <input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>{t('users.email')} *</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              </div>
              {!editingUser && (
                <div className="form-group">
                  <label>{t('users.password')} *</label>
                  <input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                </div>
              )}
              <div className="form-group">
                <label>{t('users.fullName')}</label>
                <input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>{t('users.phone')}</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label>{t('users.role')}</label>
                <select value={formData.role_id} onChange={(e) => setFormData({...formData, role_id: e.target.value})}>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name === 'admin' ? t('users.admin') : t('users.cashier')}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} />
                  {' '}{t('users.active')}
                </label>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>{t('common.cancel')}</button>
                <button type="submit" className="btn btn-primary">{t('common.save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
          alignItems: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '400px', maxWidth: '90%' }}>
            <h3 style={{ marginBottom: '16px' }}>{t('users.changePassword')}</h3>
            <form onSubmit={handlePasswordUpdate}>
              <div className="form-group">
                <label>{t('users.newPassword')}</label>
                <input type="password" value={passwordData.password} onChange={(e) => setPasswordData({ password: e.target.value })} required minLength="4" />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>{t('common.cancel')}</button>
                <button type="submit" className="btn btn-primary">{t('users.updatePassword')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
