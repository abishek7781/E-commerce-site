import React, { useEffect, useState } from 'react';

const statusColors = {
  pending: { color: '#8a6d3b', backgroundColor: '#fcf8e3' },
  shipped: { color: '#31708f', backgroundColor: '#d9edf7' },
  delivered: { color: '#3c763d', backgroundColor: '#dff0d8' },
  cancelled: { color: '#a94442', backgroundColor: '#f2dede' },
  default: { color: '#333', backgroundColor: '#f5f5f5' }
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '2rem',
    borderBottom: '2px solid #ecf0f1',
    paddingBottom: '1rem'
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '1.5rem',
    padding: '1.5rem',
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'translateY(-2px)'
    }
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  status: (status) => ({
    ...statusColors[status.toLowerCase()] || statusColors.default,
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    textTransform: 'capitalize'
  }),
  detailRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  detailItem: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '6px',
    '& strong': {
      display: 'block',
      marginBottom: '0.5rem',
      color: '#7f8c8d'
    }
  },
  itemsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  productCard: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    alignItems: 'center'
  },
  productImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '4px'
  },
  productInfo: {
    flex: 1,
    '& h3': {
      margin: '0 0 0.5rem 0',
      fontSize: '1rem'
    }
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    marginTop: '1rem'
  },
  button: {
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    transition: 'all 0.2s ease'
  },
  reorderButton: {
    backgroundColor: '#3498db',
    color: 'white',
    ':hover': {
      backgroundColor: '#2980b9'
    }
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    ':hover': {
      backgroundColor: '#c0392b'
    }
  },
  cancellationNotice: {
    color: '#e74c3c',
    fontWeight: '600',
    fontSize: '0.9rem',
    margin: '0'
  }
};

const Orders = ({ userEmail }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
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

    if (userEmail) {
      fetchOrders();
    } else {
      setLoading(false);
      setOrders([]);
    }
  }, [userEmail]);

  const requestCancellation = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/orders/${orderId}/request-cancellation`, {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error('Failed to request cancellation');
      }
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, cancellationRequested: true } : order
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading orders...</div>;
  if (error) return <div style={{ ...styles.container, color: '#e74c3c', textAlign: 'center' }}>Error: {error}</div>;
  if (orders.length === 0) return <div style={styles.container}>No orders found.</div>;

  return (
    <main style={styles.container} aria-label="User Orders">
      <h1 style={styles.title}>Your Orders</h1>
      {orders.map((order, index) => {
        const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
        const canRequestCancellation = !order.cancellationRequested && order.status !== 'Cancelled' && order.status !== 'Delivered';
        const statusStyle = styles.status(order.status.toLowerCase());

        // Fix for undefined _id: fallback to order.id if _id is missing
        const orderId = order._id || order.id;

        return (
          <article key={orderId || index} style={styles.orderCard}>
            <header style={styles.header}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#2c3e50' }}>
                Order #{(order.orderNumber || index + 1).toString().padStart(4, '0')}
              </h2>
              <div style={statusStyle}>{order.status}</div>
            </header>

            <div style={styles.detailRow}>
              <div style={styles.detailItem}>
                <strong>Order Date: </strong>
                {formatDateTime(order.order_date)}
              </div>
              <div style={styles.detailItem}>
                <strong>Delivery Address: </strong>
                {order.city}, {order.pincode}
              </div>
              <div style={styles.detailItem}>
                <strong>Total Price: </strong>
                ₹{order.total_price?.toLocaleString('en-IN')}
              </div>
              <div style={styles.detailItem}>
                <strong>Items :</strong>
                {totalItems}
              </div>
            </div>

            <div style={styles.itemsContainer}>
              {order.items.map((item, idx) => (
                <div key={idx} style={styles.productCard}>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={styles.productImage}
                    />
                  )}
                  <div style={styles.productInfo}>
                    <h3>{item.name}</h3>
                    <p>₹{item.price?.toLocaleString('en-IN')}</p>
                    <p>Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.buttonGroup}>
              <button
                style={{ ...styles.button, ...styles.reorderButton }}
                onClick={() => alert('Reorder feature coming soon!')}
              >
                Reorder
              </button>
              {canRequestCancellation && (
                <button
                  style={{ ...styles.button, ...styles.cancelButton }}
                  onClick={() => {
                    if (orderId) {
                      requestCancellation(orderId);
                    } else {
                      alert('Order ID is undefined. Cannot request cancellation.');
                    }
                  }}
                >
                  Request Cancellation
                </button>
              )}
              {order.cancellationRequested && (
                <p style={styles.cancellationNotice}>
                  Cancellation Request Received
                </p>
              )}
            </div>
          </article>
        );
      })}
    </main>
  );
};

export default Orders;