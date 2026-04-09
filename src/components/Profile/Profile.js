import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faLock, faSave, faTimes, faCamera, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { getProfile, updateProfile } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
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
      const response = await getProfile();
      setProfile(response.data);
      setFormData({
        full_name: response.data.full_name || '',
        phone: response.data.phone || ''
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const response = await updateProfile(formData);
      setProfile(response.data);
      setEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (passwordData.new_password.length < 4) {
      setMessage({ type: 'error', text: 'Password must be at least 4 characters' });
      return;
    }
    
    try {
      const response = await updateProfile({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setShowPasswordForm(false);
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Password update failed' });
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '24px', fontSize: '28px', fontWeight: '600' }}>
        <FontAwesomeIcon icon={faUser} style={{ marginRight: '12px' }} />
        My Profile
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
          <p style={{ color: '#6b7280' }}>{profile?.role_name === 'admin' ? 'Administrator' : 'User'}</p>
        </div>

        {/* Profile Info Display */}
        {!editing ? (
          <>
            <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ width: '120px', fontWeight: '600' }}>
                  <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px', color: '#6b7280' }} />
                  Username:
                </div>
                <div>{profile?.username}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ width: '120px', fontWeight: '600' }}>
                  <FontAwesomeIcon icon={faIdCard} style={{ marginRight: '8px', color: '#6b7280' }} />
                  Full Name:
                </div>
                <div>{profile?.full_name || 'Not set'}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ width: '120px', fontWeight: '600' }}>
                  <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '8px', color: '#6b7280' }} />
                  Email:
                </div>
                <div>{profile?.email}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ width: '120px', fontWeight: '600' }}>
                  <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px', color: '#6b7280' }} />
                  Phone:
                </div>
                <div>{profile?.phone || 'Not set'}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={() => setEditing(true)}>
                <FontAwesomeIcon icon={faSave} style={{ marginRight: '8px' }} />
                Edit Profile
              </button>
              <button className="btn btn-secondary" onClick={() => setShowPasswordForm(true)}>
                <FontAwesomeIcon icon={faLock} style={{ marginRight: '8px' }} />
                Change Password
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+1 234 567 8900"
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
                <FontAwesomeIcon icon={faTimes} style={{ marginRight: '8px' }} />
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <FontAwesomeIcon icon={faSave} style={{ marginRight: '8px' }} />
                Save Changes
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
              Change Password
            </h3>
            <form onSubmit={handleUpdatePassword}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                  required
                  minLength="4"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update Password</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;