import React, { useState, useEffect } from 'react';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier, searchSuppliers } from '../../services/supplierService';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contact_name: '',
    email: '',
    phone: '',
    address: '',
    tax_id: '',
    notes: ''
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await getSuppliers();
      setSuppliers(response.data || []);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchSuppliers();
      return;
    }
    try {
      setLoading(true);
      const response = await searchSuppliers(searchTerm);
      setSuppliers(response.data || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm('Are you sure you want to delete supplier "' + name + '"?')) {
      try {
        await deleteSupplier(id);
        fetchSuppliers();
        alert('Supplier deleted successfully');
      } catch (error) {
        alert('Failed to delete supplier');
      }
    }
  };

  const openAddModal = () => {
    setEditingSupplier(null);
    setFormData({
      name: '',
      contact_name: '',
      email: '',
      phone: '',
      address: '',
      tax_id: '',
      notes: ''
    });
    setShowModal(true);
  };

  const openEditModal = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contact_name: supplier.contact_name || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      tax_id: supplier.tax_id || '',
      notes: supplier.notes || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Supplier name is required');
      return;
    }

    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, formData);
        alert('Supplier updated successfully');
      } else {
        await createSupplier(formData);
        alert('Supplier created successfully');
      }
      setShowModal(false);
      fetchSuppliers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save supplier');
    }
  };

  if (loading) return <div className="loading">Loading suppliers...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600' }}>🏭 Suppliers</h1>
        <button className="btn btn-primary" onClick={openAddModal} style={{ padding: '10px 20px' }}>
          + Add Supplier
        </button>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ display: 'flex', gap: '10px', marginBottom: '20px', padding: '16px' }}>
        <input
          type="text"
          placeholder="Search by name, contact person, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="btn btn-primary" onClick={handleSearch}>🔍 Search</button>
        <button className="btn btn-secondary" onClick={() => { setSearchTerm(''); fetchSuppliers(); }}>Reset</button>
      </div>

      {/* Suppliers Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>Contact Person</th>
              <th style={{ padding: '12px' }}>Email</th>
              <th style={{ padding: '12px' }}>Phone</th>
              <th style={{ padding: '12px' }}>Tax ID</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px', fontWeight: '500' }}>{supplier.name}</td>
                <td style={{ padding: '12px' }}>{supplier.contact_name || '-'}</td>
                <td style={{ padding: '12px' }}>{supplier.email || '-'}</td>
                <td style={{ padding: '12px' }}>{supplier.phone || '-'}</td>
                <td style={{ padding: '12px' }}>{supplier.tax_id || '-'}</td>
                <td style={{ padding: '12px' }}>
                  <button className="btn btn-primary" style={{ marginRight: '8px', padding: '6px 12px' }} onClick={() => openEditModal(supplier)}>Edit</button>
                  <button className="btn btn-danger" style={{ padding: '6px 12px' }} onClick={() => handleDelete(supplier.id, supplier.name)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {suppliers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px' }}>No suppliers found</div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
          alignItems: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '550px', maxWidth: '90%', maxHeight: '90%', overflow: 'auto' }}>
            <h3 style={{ marginBottom: '16px' }}>{editingSupplier ? 'Edit Supplier' : 'Add Supplier'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Supplier Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Contact Person</label>
                <input type="text" value={formData.contact_name} onChange={(e) => setFormData({...formData, contact_name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} rows="2" />
              </div>
              <div className="form-group">
                <label>Tax ID / VAT</label>
                <input type="text" value={formData.tax_id} onChange={(e) => setFormData({...formData, tax_id: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} rows="2" />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierList;
