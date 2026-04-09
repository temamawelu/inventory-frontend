import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory, searchCategories } from '../../services/categoryService';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchCategories();
      return;
    }
    try {
      setLoading(true);
      const response = await searchCategories(searchTerm);
      setCategories(response.data || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const confirmMessage = 'Are you sure you want to delete category "' + name + '"?';
    if (window.confirm(confirmMessage)) {
      try {
        const response = await deleteCategory(id);
        if (response.success) {
          alert('Category deleted successfully');
          fetchCategories();
        } else {
          alert(response.message || 'Failed to delete category');
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to delete category';
        alert(errorMessage);
      }
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Category name is required');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        alert('Category updated successfully');
      } else {
        await createCategory(formData);
        alert('Category created successfully');
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to save category';
      alert(errorMessage);
    }
  };

  if (loading) return <div className="loading">Loading categories...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600' }}>🏷️ Categories</h1>
        <button className="btn btn-primary" onClick={openAddModal} style={{ padding: '10px 20px' }}>
          + Add Category
        </button>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ display: 'flex', gap: '10px', marginBottom: '20px', padding: '16px' }}>
        <input
          type="text"
          placeholder="Search by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="btn btn-primary" onClick={handleSearch}>🔍 Search</button>
        <button className="btn btn-secondary" onClick={() => { setSearchTerm(''); fetchCategories(); }}>Reset</button>
      </div>

      {/* Categories Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>Description</th>
              <th style={{ padding: '12px' }}>Created Date</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px' }}>{category.id}</td>
                <td style={{ padding: '12px', fontWeight: '500' }}>{category.name}</td>
                <td style={{ padding: '12px' }}>{category.description || '-'}</td>
                <td style={{ padding: '12px' }}>{new Date(category.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '12px' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ marginRight: '8px', padding: '6px 12px' }} 
                    onClick={() => openEditModal(category)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger" 
                    style={{ padding: '6px 12px' }} 
                    onClick={() => handleDelete(category.id, category.name)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px' }}>No categories found</div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
          alignItems: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '450px', maxWidth: '90%' }}>
            <h3 style={{ marginBottom: '16px' }}>{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="e.g., Electronics"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  placeholder="Brief description of the category"
                />
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

export default CategoryList;
