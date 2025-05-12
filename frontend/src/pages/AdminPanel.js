import React, { useEffect, useState } from 'react';

const statusOptions = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5001/api/admin/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setError('');
    setSuccessMsg('');
    try {
      const response = await fetch(`http://localhost:5001/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      setSuccessMsg('Order status updated successfully');
      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus, cancellationRequested: false } : order
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = '/';
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Delivered':
        return { backgroundColor: '#5cb85c', color: 'white', fontWeight: '600', padding: '0.5rem 1rem', borderRadius: '20px', textTransform: 'capitalize', textAlign: 'center' };
      case 'Cancelled':
        return { backgroundColor: '#d9534f', color: 'white', fontWeight: '600', padding: '0.5rem 1rem', borderRadius: '20px', textTransform: 'capitalize', textAlign: 'center' };
      case 'Shipped':
        return { backgroundColor: '#5bc0de', color: 'white', fontWeight: '600', padding: '0.5rem 1rem', borderRadius: '20px', textTransform: 'capitalize', textAlign: 'center' };
      default:
        return { backgroundColor: '#f0ad4e', color: 'white', fontWeight: '600', padding: '0.5rem 1rem', borderRadius: '20px', textTransform: 'capitalize', textAlign: 'center' };
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '1rem', fontFamily: 'Arial, sans-serif', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Admin Panel - Manage Orders</h1>
        <div>
          <button
            style={{ marginRight: '1rem', backgroundColor: '#3498db', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.3s ease' }}
            onClick={() => window.location.href = '/admin-users'}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2980b9'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#3498db'}
          >
            Manage Users
          </button>
          <button
            style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.3s ease' }}
            onClick={handleLogout}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#c0392b'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#e74c3c'}
          >
            Logout
          </button>
        </div>
      </div>
      {loading && <p>Loading orders...</p>}
      {error && <p style={{ color: '#e74c3c', fontWeight: 'bold', marginBottom: '1rem' }}>{error}</p>}
      {successMsg && <p style={{ color: '#27ae60', fontWeight: 'bold', marginBottom: '1rem' }}>{successMsg}</p>}
      {!loading && orders.length === 0 && <p>No orders found.</p>}
      {!loading && orders.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '0.75rem', textAlign: 'left', backgroundColor: '#f4f6f8', fontWeight: 'bold' }}>Order ID</th>
              <th style={{ border: '1px solid #ddd', padding: '0.75rem', textAlign: 'left', backgroundColor: '#f4f6f8', fontWeight: 'bold' }}>User Email</th>
              <th style={{ border: '1px solid #ddd', padding: '0.75rem', textAlign: 'left', backgroundColor: '#f4f6f8', fontWeight: 'bold' }}>Order Date</th>
              <th style={{ border: '1px solid #ddd', padding: '0.75rem', textAlign: 'left', backgroundColor: '#f4f6f8', fontWeight: 'bold' }}>Total Price</th>
              <th style={{ border: '1px solid #ddd', padding: '0.75rem', textAlign: 'left', backgroundColor: '#f4f6f8', fontWeight: 'bold' }}>Status</th>
              <th style={{ border: '1px solid #ddd', padding: '0.75rem', textAlign: 'left', backgroundColor: '#f4f6f8', fontWeight: 'bold' }}>Cancellation Requested</th>
              <th style={{ border: '1px solid #ddd', padding: '0.75rem', textAlign: 'left', backgroundColor: '#f4f6f8', fontWeight: 'bold' }}>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order._id}
                style={hoveredRow === index ? { backgroundColor: '#f9f9f9' } : {}}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td style={{ border: '1px solid #ddd', padding: '0.75rem' }} className="id-cell">{order._id}</td>
                <td style={{ border: '1px solid #ddd', padding: '0.75rem' }}>{order.user_email}</td>
                <td style={{ border: '1px solid #ddd', padding: '0.75rem' }}>{order.order_date ? new Date(order.order_date).toLocaleString() : 'N/A'}</td>
                <td style={{ border: '1px solid #ddd', padding: '0.75rem' }}>₹{order.total_price}</td>
                <td style={{ border: '1px solid #ddd', padding: '0.75rem', ...getStatusClass(order.status) }}>{order.status}</td>
                <td style={{ border: '1px solid #ddd', padding: '0.75rem', color: order.cancellationRequested ? '#d9534f' : '#5cb85c', fontWeight: '700', textAlign: 'center' }}>
                  {order.cancellationRequested ? 'Yes' : 'No'}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '0.75rem' }}>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    style={{ padding: '0.3rem 0.5rem', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;
