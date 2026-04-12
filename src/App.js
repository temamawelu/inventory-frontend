import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import ProductList from './components/Products/ProductList';
import SupplierList from './components/Suppliers/SupplierList';
import CategoryList from './components/Categories/CategoryList';
import TransactionList from './components/Transactions/TransactionList';
import LowStockAlert from './components/Products/LowStockAlert';
import Profile from './components/Profile/Profile';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import './App.css';

const AppLayout = ({ children }) => (
  <>
    <Navbar />
    <Sidebar />
    <main style={{ marginLeft: '250px', padding: '20px', marginTop: '60px' }}>
      {children}
    </main>
  </>
);

function AppContent() {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="loading">Loading...</div>;
  
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }
  
  return (
    <AppLayout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/suppliers" element={<SupplierList />} />
        <Route path="/transactions" element={<TransactionList />} />
        <Route path="/low-stock" element={<LowStockAlert />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </AppLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;