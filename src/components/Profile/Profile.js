import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faLock, faSave, faTimes, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/profile');
      setProfile(response.data.data);
      setFormData({
        full_name: response.data.data.full_name || '',
        phone: response.data.data.phone || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: t('profile.fetchError') });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);
    
    try {
      const response = await api.put('/profile', {
        full_name: formData.full_name,
        phone: formData.phone
      });
      
      if (response.data.success) {
        setProfile(response.data.data);
        setEditing(false);
        setMessage({ type: 'success', text: t('profile.profileUpdated') });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: response.data.message || t('profile.updateFailed') });
      }
    } catch (error) {
      console.error('Update error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || t('profile.updateFailed') 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'error', text: t('profile.passwordMismatch') });
      return;
    }
    
    if (passwordData.new_password.length < 4) {
      setMessage({ type: 'error', text: t('profile.passwordTooShort') });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.put('/profile/password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      
      if (response.data.success) {
        setMessage({ type: 'success', text: t('profile.passwordUpdated') });
        setShowPasswordForm(false);
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: response.data.message || t('profile.passwordUpdateFailed') });
      }
    } catch (error) {
      console.error('Password update error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || t('profile.passwordUpdateFailed') 
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">{t('common.loading')}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '24px', fontSize: '28px', fontWeight: '600' }}>
        <FontAwesomeIcon icon={faUser} style={{ marginRight: '12px' }} />
        {t('profile.title')}
      </h1>

      {message.text && (
        <div className={message.type === 'success' ? 'success' : 'error'} style={{ marginBottom: '20px' }}>
          {message.text}
        </div>
      )}

      <div className="card">
        {/* Profile Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '100px',
            height: '100px',
            background: '#2563eb',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '48px',
            color: 'white'
          }}>
            <FontAwesomeIcon icon={faUser} size="2x" />
          </div>
          <h2 style={{ marginBottom: '4px' }}>{profile?.full_name || profile?.username}</h2>
          <p style={{ color: '#6b7280' }}>
            {profile?.role_name === 'admin' ? t('profile.admin') : t('profile.user')}
          </p>
        </div>

        {/* Profile Info Display */}
        {!editing ? (
          <>
            <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ width: '120px', fontWeight: '600' }}>
                  <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px', color: '#6b7280' }} />
                  {t('profile.username')}
                </div>
                <div>{profile?.username}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ width: '120px', fontWeight: '600' }}>
                  <FontAwesomeIcon icon={faIdCard} style={{ marginRight: '8px', color: '#6b7280' }} />
                  {t('profile.fullName')}
                </div>
                <div>{profile?.full_name || t('profile.notSet')}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ width: '120px', fontWeight: '600' }}>
                  <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '8px', color: '#6b7280' }} />
                  {t('profile.email')}
                </div>
                <div>{profile?.email}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ width: '120px', fontWeight: '600' }}>
                  <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px', color: '#6b7280' }} />
                  {t('profile.phone')}
                </div>
                <div>{profile?.phone || t('profile.notSet')}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={() => setEditing(true)} disabled={loading}>
                <FontAwesomeIcon icon={faSave} style={{ marginRight: '8px' }} />
                {t('profile.editProfile')}
              </button>
              <button className="btn btn-secondary" onClick={() => setShowPasswordForm(true)} disabled={loading}>
                <FontAwesomeIcon icon={faLock} style={{ marginRight: '8px' }} />
                {t('profile.changePassword')}
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>{t('profile.fullName')}</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                placeholder={t('profile.fullNamePlaceholder')}
              />
            </div>
            <div className="form-group">
              <label>{t('profile.phone')}</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder={t('profile.phonePlaceholder')}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)} disabled={loading}>
                <FontAwesomeIcon icon={faTimes} style={{ marginRight: '8px' }} />
                {t('common.cancel')}
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <FontAwesomeIcon icon={faSave} style={{ marginRight: '8px' }} />
                {loading ? t('common.loading') : t('common.save')}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Change Password Modal */}
      {showPasswordForm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
          alignItems: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '450px', maxWidth: '90%' }}>
            <h3 style={{ marginBottom: '16px' }}>
              <FontAwesomeIcon icon={faLock} style={{ marginRight: '8px' }} />
              {t('profile.changePassword')}
            </h3>
            <form onSubmit={handleUpdatePassword}>
              <div className="form-group">
                <label>{t('profile.currentPassword')}</label>
                <input
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('profile.newPassword')}</label>
                <input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                  required
                  minLength="4"
                />
              </div>
              <div className="form-group">
                <label>{t('profile.confirmPassword')}</label>
                <input
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordForm(false)} disabled={loading}>
                  {t('common.cancel')}
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? t('common.loading') : t('profile.updatePassword')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
