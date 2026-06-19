import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useTranslation } from 'react-i18next';   

const TransactionHistory = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterProduct, setFilterProduct] = useState("");
  const [products, setProducts] = useState([]);

  const exportToExcel = () => {
    const token = localStorage.getItem("token");
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
    window.open(apiUrl + "/export/transactions?token=" + token, "_blank");
  };

  useEffect(() => {
    fetchTransactions();
    fetchProducts();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.get("/transactions/history");
      setTransactions(response.data.data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const filterByProduct = async (productId) => {
    setFilterProduct(productId);
    try {
      setLoading(true);
      const url = productId ? "/transactions/history?product_id=" + productId : "/transactions/history";
      const response = await api.get(url);
      setTransactions(response.data.data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">{t('Loading transactions...')}</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "600" }}>  {t('📋 Transaction History')}</h1>
        <button className="btn btn-success" onClick={exportToExcel}>
          {t('📊 Export Excel')}
        </button>
      </div>

      <div className="card" style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
        <label style={{ fontWeight: "500" }}>{t('Filter by Product:')}</label>
        <select
          value={filterProduct}
          onChange={(e) => filterByProduct(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd", flex: "1" }}
        >
          <option value="">All Products</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.sku} - {p.name}
            </option>
          ))}
        </select>
        {filterProduct && (
          <button className="btn btn-secondary" onClick={() => filterByProduct("")}>
            {t('Clear Filter')}
          </button>
        )}
      </div>

      <div className="card" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              <th style={{ padding: "12px" }}>{t('Product')}</th>
              <th style={{ padding: "12px" }}>{t('Type')}</th>
              <th style={{ padding: "12px" }}>{t('Quantity')}</th>
              <th style={{ padding: "12px" }}>{t('Before')}</th>
              <th style={{ padding: "12px" }}>{t('After')}</th>
              <th style={{ padding: "12px" }}>{t('Reference')}</th>
              <th style={{ padding: "12px" }}>{t('User')}</th>
              <th style={{ padding: "12px" }}>{t('Date')}</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "12px" }}>{transaction.product_name}</td>
                <td style={{ padding: "12px" }}>
                  <span
                    style={{
                      background: transaction.transaction_type_name === "GOODS_RECEIPT" ? "#d1fae5" : "#fee2e2",
                      color: transaction.transaction_type_name === "GOODS_RECEIPT" ? "#059669" : "#dc2626",
                      padding: "4px 8px",
                      borderRadius: "20px",
                      fontSize: "12px"
                    }}
                  >
                    {transaction.transaction_type_name === "GOODS_RECEIPT" ? "📥 Receipt" : "📤 Issue"}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>{transaction.quantity}</td>
                <td style={{ padding: "12px" }}>{transaction.quantity_before}</td>
                <td style={{ padding: "12px" }}>{transaction.quantity_after}</td>
                <td style={{ padding: "12px" }}>{transaction.reference_number || "-"}</td>
                <td style={{ padding: "12px" }}>{transaction.user_name || "-"}</td>
                <td style={{ padding: "12px" }}>{new Date(transaction.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px" }}>{t('No transactions found')}</div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
