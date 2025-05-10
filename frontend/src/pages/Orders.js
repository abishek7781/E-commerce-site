import React, { useEffect, useState } from 'react';

const Orders = ({ userEmail }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userEmail) {
      setError('User not logged in');
      setLoading(false);
      return;
    }
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/orders/' + encodeURIComponent(userEmail));
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
    fetchOrders();
  }, [userEmail]);

  if (loading) {
    return <div className="page orders-page" style={{ padding: '2rem' }}>Loading orders...</div>;
  }

  if (error) {
    return <div className="page orders-page" style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>;
  }

  if (orders.length === 0) {
    return <div className="page orders-page" style={{ padding: '2rem' }}>No orders found.</div>;
  }

  return (
    <div className="page orders-page" style={{ maxWidth: '700px', margin: '2rem auto', padding: '0 1rem', paddingTop: '7rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem', color: '#2874f0' }}>Your Orders</h1>
      {orders.map((order, index) => (
        <div
          key={index}
          className="order-card"
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            width: '700px'
          }}
        >
          <h3 style={{ marginBottom: '0.5rem' }}>Order #{index + 1}</h3>
          <p><strong>City:</strong> {order.city}</p>
          <p><strong>Pincode:</strong> {order.pincode}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total Price:</strong> ₹{order.total_price}</p>
          <div>
            <strong>Items:</strong>
            <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
              {order.items.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: '700', color: '#2874f0' }}>
                    {item.name} - Price: ₹{item.price}
                  </div>
                  <div>
                    Quantity: {item.quantity}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
