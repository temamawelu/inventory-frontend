import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import ProductList from './components/Products/ProductList';
import SupplierList from './components/Suppliers/SupplierList';
import CategoryList from './components/Categories/CategoryList';
import GoodsReceipt from './components/Transactions/GoodsReceipt';
import GoodsIssue from './components/Transactions/GoodsIssue';
import TransactionHistory from './components/Transactions/TransactionHistory';
import LowStockAlert from './components/Products/LowStockAlert';
import Profile from './components/Profile/Profile';
import UserList from './components/Users/UserList';
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
        <Route path="/receipt" element={<GoodsReceipt />} />
        <Route path="/issue" element={<GoodsIssue />} />
        <Route path="/transactions" element={<TransactionHistory />} />
        <Route path="/low-stock" element={<LowStockAlert />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users" element={<UserList />} />
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
