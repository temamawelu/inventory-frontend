import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    category_id: '',
    unit_price: '',
    quantity_on_hand: 0,
    reorder_point: 0,
    location: ''
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Categories error:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchProducts();
      return;
    }
    try {
      setLoading(true);
      const response = await api.get('/products/search?q=' + encodeURIComponent(searchTerm));
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await api.delete('/products/' + id);
        fetchProducts();
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      sku: '',
      name: '',
      description: '',
      category_id: '',
      unit_price: '',
      quantity_on_hand: 0,
      reorder_point: 0,
      location: ''
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku,
      name: product.name,
      description: product.description || '',
      category_id: product.category_id || '',
      unit_price: product.unit_price,
      quantity_on_hand: product.quantity_on_hand,
      reorder_point: product.reorder_point,
      location: product.location || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        sku: formData.sku,
        name: formData.name,
        description: formData.description,
        category_id: formData.category_id || null,
        unit_price: parseFloat(formData.unit_price) || 0,
        quantity_on_hand: parseInt(formData.quantity_on_hand) || 0,
        reorder_point: parseInt(formData.reorder_point) || 0,
        location: formData.location || null
      };

      if (editingProduct) {
        await api.put('/products/' + editingProduct.id, dataToSend);
      } else {
        await api.post('/products', dataToSend);
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save product');
    }
  };

  // Safe price formatter
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '0.00';
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600' }}>📦 Products</h1>
        <button className="btn btn-primary" onClick={openAddModal} style={{ padding: '10px 20px' }}>
          + Add Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ display: 'flex', gap: '10px', marginBottom: '20px', padding: '16px' }}>
        <input
          type="text"
          placeholder="Search by name, SKU, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="btn btn-primary" onClick={handleSearch}>🔍 Search</button>
        <button className="btn btn-secondary" onClick={() => { setSearchTerm(''); fetchProducts(); }}>Reset</button>
      </div>

      {/* Products Table */}
      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: '12px' }}>SKU</th>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>Category</th>
              <th style={{ padding: '12px' }}>Price</th>
              <th style={{ padding: '12px' }}>Stock</th>
              <th style={{ padding: '12px' }}>Location</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px' }}>{product.sku}</td>
                <td style={{ padding: '12px' }}>{product.name}</td>
                <td style={{ padding: '12px' }}>{product.category_name || '-'}</td>
                <td style={{ padding: '12px' }}></td>
                <td style={{ padding: '12px', color: product.quantity_on_hand <= product.reorder_point ? '#dc2626' : '#10b981' }}>
                  {product.quantity_on_hand}
                  {product.quantity_on_hand <= product.reorder_point && (
                    <span style={{ marginLeft: '8px', fontSize: '12px', background: '#fee2e2', padding: '2px 6px', borderRadius: '12px' }}>
                      Low
                    </span>
                  )}
                </td>
                <td style={{ padding: '12px' }}>{product.location || '-'}</td>
                <td style={{ padding: '12px' }}>
                  <button className="btn btn-primary" style={{ marginRight: '8px', padding: '6px 12px' }} onClick={() => openEditModal(product)}>Edit</button>
                  <button className="btn btn-danger" style={{ padding: '6px 12px' }} onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px' }}>No products found</div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
          alignItems: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '500px', maxWidth: '90%', maxHeight: '90%', overflow: 'auto' }}>
            <h3 style={{ marginBottom: '16px' }}>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>SKU *</label>
                <input type="text" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})}>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Unit Price *</label>
                <input type="number" step="0.01" value={formData.unit_price} onChange={(e) => setFormData({...formData, unit_price: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Quantity on Hand</label>
                <input type="number" value={formData.quantity_on_hand} onChange={(e) => setFormData({...formData, quantity_on_hand: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Reorder Point (Min Stock)</label>
                <input type="number" value={formData.reorder_point} onChange={(e) => setFormData({...formData, reorder_point: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="A1-Shelf1" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" />
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

export default ProductList;
